'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { createMeasurement } from '@/services/measurementService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DressType } from '@/lib/types';

interface CustomNoteField {
  title: string;
  description: string;
}

interface MeasurementFormValues {
  unit: string;
  dressType: DressType;
  notes: string;
  kameezLength: string;
  kameezShoulder: string;
  kameezSleeves: string;
  kameezNeck: string;
  kameezChest: string;
  kameezWaist: string;
  kameezArmhole: string;
  kameezCuff: string;
  kameezCuffWidth: string;
  shalwarLength: string;
  shalwarWidth: string;
  shalwarPancha: string;
  customNotes: CustomNoteField[];
}

const KAMEEZ_FIELDS: { key: keyof MeasurementFormValues; label: string; urdu: string }[] = [
  { key: 'kameezLength',    label: 'Length',     urdu: '' },
  { key: 'kameezShoulder',  label: 'Shoulder',   urdu: 'تیرہ' },
  { key: 'kameezSleeves',   label: 'Sleeves',    urdu: 'بازو' },
  { key: 'kameezNeck',      label: 'Neck',       urdu: 'گلہ' },
  { key: 'kameezChest',     label: 'Chest',      urdu: 'چھاتی' },
  { key: 'kameezWaist',     label: 'Waist',      urdu: 'کمر' },
  { key: 'kameezArmhole',   label: 'Armhole',    urdu: 'مونڈھا' },
  { key: 'kameezCuff',      label: 'Cuff',       urdu: 'کف' },
  { key: 'kameezCuffWidth', label: 'Cuff Width', urdu: 'چوڑائی' },
];

const SHALWAR_FIELDS: { key: keyof MeasurementFormValues; label: string; urdu: string }[] = [
  { key: 'shalwarLength', label: 'Length', urdu: '' },
  { key: 'shalwarWidth',  label: 'Width',  urdu: '' },
  { key: 'shalwarPancha', label: 'Pancha', urdu: 'پانچا' },
];

const DEFAULT_VALUES: MeasurementFormValues = {
  unit: 'inches',
  dressType: 'shalwar_kameez',
  notes: '',
  kameezLength: '', kameezShoulder: '', kameezSleeves: '', kameezNeck: '',
  kameezChest: '', kameezWaist: '', kameezArmhole: '', kameezCuff: '', kameezCuffWidth: '',
  shalwarLength: '', shalwarWidth: '', shalwarPancha: '',
  customNotes: [],
};

export function MeasurementForm({ customerId, onSaved }: { customerId: string; onSaved: () => void }) {
  const { appUser } = useAuth();
  const { register, handleSubmit, reset, watch, control, formState: { isSubmitting } } =
    useForm<MeasurementFormValues>({ defaultValues: DEFAULT_VALUES });
  const { fields: noteFields, append, remove } = useFieldArray({ control, name: 'customNotes' });

  const dressType = watch('dressType');
  const showKameez = dressType === 'kameez' || dressType === 'shalwar_kameez';
  const showShalwar = dressType === 'shalwar' || dressType === 'shalwar_kameez';

  const toNum = (v: string) => v.trim() !== '' ? Number(v) : null;

  const onSubmit = handleSubmit(async (data) => {
    if (!appUser) return;
    try {
      await createMeasurement({
        customerId,
        takenBy: appUser.uid,
        unit: data.unit as 'inches' | 'cm',
        dressType: data.dressType,
        notes: data.notes || '',
        customNotes: data.customNotes.filter(n => n.title || n.description),
        kameezLength:    toNum(data.kameezLength),
        kameezShoulder:  toNum(data.kameezShoulder),
        kameezSleeves:   toNum(data.kameezSleeves),
        kameezNeck:      toNum(data.kameezNeck),
        kameezChest:     toNum(data.kameezChest),
        kameezWaist:     toNum(data.kameezWaist),
        kameezArmhole:   toNum(data.kameezArmhole),
        kameezCuff:      toNum(data.kameezCuff),
        kameezCuffWidth: toNum(data.kameezCuffWidth),
        shalwarLength:   toNum(data.shalwarLength),
        shalwarWidth:    toNum(data.shalwarWidth),
        shalwarPancha:   toNum(data.shalwarPancha),
      } as any);
      toast.success('Measurements recorded!');
      reset(DEFAULT_VALUES);
      onSaved();
    } catch {
      toast.error('Failed to save measurements');
    }
  });

  return (
    <form onSubmit={onSubmit} className="glass-card p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Record Measurements</h2>
        <select {...register('unit')} className="input-base px-3 py-1.5 border rounded-lg text-sm">
          <option value="inches">Inches</option>
          <option value="cm">CM</option>
        </select>
      </div>

      {/* Dress type selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dress Type</label>
        <div className="flex gap-4 flex-wrap">
          {[
            { value: 'shalwar_kameez', label: 'Shalwar Kameez' },
            { value: 'kameez',         label: 'Kameez Only' },
            { value: 'shalwar',        label: 'Shalwar Only' },
            { value: 'other',          label: 'Other' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" value={opt.value} {...register('dressType')} className="accent-brand-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Kameez / قمیض */}
      {showKameez && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
            Kameez
            <span className="text-slate-400 dark:text-slate-500 font-normal text-sm" dir="rtl">قمیض</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {KAMEEZ_FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  {f.label}
                  {f.urdu && <span className="text-slate-400 dark:text-slate-500" dir="rtl">{f.urdu}</span>}
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  {...register(f.key)}
                  className="input-base w-full border rounded-lg px-3 py-2 text-center"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shalwar / شلوار */}
      {showShalwar && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
            Shalwar
            <span className="text-slate-400 dark:text-slate-500 font-normal text-sm" dir="rtl">شلوار</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SHALWAR_FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  {f.label}
                  {f.urdu && <span className="text-slate-400 dark:text-slate-500" dir="rtl">{f.urdu}</span>}
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  {...register(f.key)}
                  className="input-base w-full border rounded-lg px-3 py-2 text-center"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          className="input-base w-full border rounded-lg px-4 py-2 resize-none"
          placeholder="Fit preferences, special instructions..."
          rows={2}
        />
      </div>

      {/* Additional custom details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Additional Details</span>
          <button
            type="button"
            onClick={() => append({ title: '', description: '' })}
            className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {noteFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                {...register(`customNotes.${index}.title`)}
                placeholder="Title (e.g. Design, Buttons...)"
                className="input-base border rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                {...register(`customNotes.${index}.description`)}
                placeholder="Description..."
                className="input-base border rounded-lg px-3 py-2 text-sm sm:col-span-2 resize-none"
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-1 p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Remove detail"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2 flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Measurements
        </button>
      </div>
    </form>
  );
}
