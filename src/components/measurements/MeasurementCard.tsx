import type { Measurement } from '@/lib/types';
import { Ruler, Calendar } from 'lucide-react';

const KAMEEZ_DISPLAY = [
  { key: 'kameezLength',    label: 'Length',     urdu: '' },
  { key: 'kameezShoulder',  label: 'Shoulder',   urdu: 'تیرہ' },
  { key: 'kameezSleeves',   label: 'Sleeves',    urdu: 'بازو' },
  { key: 'kameezNeck',      label: 'Neck',       urdu: 'گلہ' },
  { key: 'kameezChest',     label: 'Chest',      urdu: 'چھاتی' },
  { key: 'kameezWaist',     label: 'Waist',      urdu: 'کمر' },
  { key: 'kameezArmhole',   label: 'Armhole',    urdu: 'مونڈھا' },
  { key: 'kameezCuff',      label: 'Cuff',       urdu: 'کف' },
  { key: 'kameezCuffWidth', label: 'Cuff Width', urdu: 'چوڑائی' },
] as const;

const SHALWAR_DISPLAY = [
  { key: 'shalwarLength', label: 'Length', urdu: '' },
  { key: 'shalwarWidth',  label: 'Width',  urdu: '' },
  { key: 'shalwarPancha', label: 'Pancha', urdu: 'پانچا' },
] as const;

const LEGACY_FIELDS = ['chest', 'waist', 'hips', 'shoulder', 'sleeves', 'length', 'inseam', 'neck'] as const;

const DRESS_TYPE_LABELS: Record<string, string> = {
  shalwar_kameez: 'Shalwar Kameez',
  kameez: 'Kameez',
  shalwar: 'Shalwar',
  other: 'Other',
};

function MeasurementGrid({ items }: { items: { label: string; urdu: string; value: number | null | undefined }[] }) {
  const visible = items.filter(i => i.value != null);
  if (visible.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {visible.map(item => (
        <div key={item.label} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 flex-wrap">
            {item.label}
            {item.urdu && <span dir="rtl" className="text-slate-400 dark:text-slate-500">{item.urdu}</span>}
          </p>
          <p className="font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function MeasurementCard({ measurement }: { measurement: Measurement }) {
  const hasNewFormat = !!measurement.dressType;
  const showKameez = hasNewFormat && (measurement.dressType === 'kameez' || measurement.dressType === 'shalwar_kameez');
  const showShalwar = hasNewFormat && (measurement.dressType === 'shalwar' || measurement.dressType === 'shalwar_kameez');

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Version {measurement.version}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {measurement.unit}
              {measurement.dressType && ` · ${DRESS_TYPE_LABELS[measurement.dressType] ?? measurement.dressType}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{measurement.createdAt?.toDate().toLocaleDateString()}</span>
        </div>
      </div>

      {showKameez && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            Kameez <span dir="rtl" className="text-slate-400 dark:text-slate-500 font-normal">قمیض</span>
          </p>
          <MeasurementGrid
            items={KAMEEZ_DISPLAY.map(f => ({ label: f.label, urdu: f.urdu, value: measurement[f.key] }))}
          />
        </div>
      )}

      {showShalwar && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            Shalwar <span dir="rtl" className="text-slate-400 dark:text-slate-500 font-normal">شلوار</span>
          </p>
          <MeasurementGrid
            items={SHALWAR_DISPLAY.map(f => ({ label: f.label, urdu: f.urdu, value: measurement[f.key] }))}
          />
        </div>
      )}

      {!hasNewFormat && (
        <MeasurementGrid
          items={LEGACY_FIELDS.map(f => ({ label: f, urdu: '', value: measurement[f] }))}
        />
      )}

      {measurement.notes && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{measurement.notes}"</p>
        </div>
      )}

      {measurement.customNotes && measurement.customNotes.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Additional Details</p>
          {measurement.customNotes.map((note, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
              {note.title && <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-0.5">{note.title}</p>}
              {note.description && <p className="text-sm text-slate-600 dark:text-slate-400">{note.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
