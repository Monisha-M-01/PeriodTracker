import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logSymptomFn } from '../../api/symptoms.api';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const SymptomCategoryEnum = z.enum([
  'CRAMPS', 'MOOD', 'FLOW', 'HEADACHE', 'ACNE', 'ENERGY', 'DIGESTION', 'OTHER'
]);

const symptomSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  category: SymptomCategoryEnum,
  type: z.string().min(1, 'Type is required (e.g. "Heavy", "Sad")'),
  intensity: z.number().min(1).max(5).optional().nullable(),
  notes: z.string().optional(),
});

type SymptomFormData = z.infer<typeof symptomSchema>;

interface LogSymptomFormProps {
  selectedDate?: string;
  onSuccess?: () => void;
}

export function LogSymptomForm({ selectedDate, onSuccess }: LogSymptomFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<SymptomFormData>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      date: selectedDate || new Date().toISOString().split('T')[0],
      category: 'MOOD',
      type: '',
      intensity: 3,
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SymptomFormData) => logSymptomFn({
      ...data,
      date: new Date(data.date).toISOString()
    }),
    onSuccess: (res) => {
      if (res.success) {
        toast('Symptom logged successfully', 'success');
        queryClient.invalidateQueries({ queryKey: ['symptoms'] });
        onSuccess?.();
      }
    },
    onError: (err: any) => {
      toast(err.response?.data?.error || 'Failed to log symptom', 'error');
    }
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date *</label>
        <Input type="date" {...register("date")} className={errors.date ? "border-destructive" : ""} />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category *</label>
        <select 
          {...register("category")} 
          className="flex h-10 w-full rounded-md border border-muted bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="CRAMPS">Cramps</option>
          <option value="MOOD">Mood</option>
          <option value="FLOW">Flow</option>
          <option value="HEADACHE">Headache</option>
          <option value="ACNE">Acne</option>
          <option value="ENERGY">Energy</option>
          <option value="DIGESTION">Digestion</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type / Details *</label>
        <Input type="text" placeholder="e.g. Heavy, Happy, Spotting" {...register("type")} className={errors.type ? "border-destructive" : ""} />
        {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Intensity (1-5)</label>
        <Input type="number" min="1" max="5" {...register("intensity", { valueAsNumber: true })} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Input type="text" placeholder="Optional notes" {...register("notes")} />
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Log Symptom"}
      </Button>
    </form>
  );
}
