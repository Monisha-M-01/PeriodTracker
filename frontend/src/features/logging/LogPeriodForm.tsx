import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logPeriodFn, updatePeriodFn } from '../../api/period.api';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { PeriodLog } from '../../types';

const periodSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  notes: z.string().optional(),
}).refine(data => !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

type PeriodFormData = z.infer<typeof periodSchema>;

interface LogPeriodFormProps {
  existingLog?: PeriodLog;
  selectedDate?: string;
  onSuccess?: () => void;
}

export function LogPeriodForm({ existingLog, selectedDate, onSuccess }: LogPeriodFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<PeriodFormData>({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      startDate: existingLog?.startDate ? new Date(existingLog.startDate).toISOString().split('T')[0] : (selectedDate || new Date().toISOString().split('T')[0]),
      endDate: existingLog?.endDate ? new Date(existingLog.endDate).toISOString().split('T')[0] : '',
      notes: existingLog?.notes || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PeriodFormData) => {
      // transform dates to ISO
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };
      if (existingLog) {
        return updatePeriodFn(existingLog.id, payload);
      }
      return logPeriodFn(payload);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast(`Period ${existingLog ? 'updated' : 'logged'} successfully`, 'success');
        queryClient.invalidateQueries({ queryKey: ['periods'] });
        queryClient.invalidateQueries({ queryKey: ['predictions'] });
        onSuccess?.();
      }
    },
    onError: (err: any) => {
      toast(err.response?.data?.error || 'Failed to log period', 'error');
    }
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Date *</label>
        <Input type="date" {...register("startDate")} className={errors.startDate ? "border-destructive" : ""} />
        {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End Date</label>
        <Input type="date" {...register("endDate")} className={errors.endDate ? "border-destructive" : ""} />
        {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Input type="text" placeholder="Optional notes" {...register("notes")} />
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Save Period"}
      </Button>
    </form>
  );
}
