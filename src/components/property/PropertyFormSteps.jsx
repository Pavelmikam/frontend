import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageDropzone from './ImageDropzone';
import PropertyAmenitiesGrid from './PropertyAmenitiesGrid';
import {
  PROPERTY_TYPES, CITIES_CAMEROUN, AMENITIES, CHARGES_INCLUDED,
} from '@/utils/constants';
import { formatPrice } from '@/utils/formatters';

// ── Schémas Zod par étape ─────────────────────────────────
const step1Schema = z.object({
  title:       z.string().min(10, 'Minimum 10 caractères').max(200),
  type:        z.enum(PROPERTY_TYPES.map((t) => t.value), { message: 'Type requis' }),
  description: z.string().min(50, 'Minimum 50 caractères').max(5000),
});

const step2Schema = z.object({
  address:      z.string().min(1, 'Adresse requise').max(255),
  city:         z.enum(CITIES_CAMEROUN, { message: 'Ville requise' }),
  neighborhood: z.string().max(100).optional(),
  latitude:     z.coerce.number().min(-90).max(90).optional().or(z.literal('')),
  longitude:    z.coerce.number().min(-180).max(180).optional().or(z.literal('')),
});

const step3Schema = z.object({
  price:             z.coerce.number().min(5000, 'Minimum 5 000 FCFA').max(10000000),
  surface:           z.coerce.number().min(5).optional().or(z.literal('')),
  rooms:             z.coerce.number().int().min(1).optional().or(z.literal('')),
  floor:             z.coerce.number().int().min(0).optional().or(z.literal('')),
  deposit_amount:    z.coerce.number().min(0).optional().or(z.literal('')),
  available_from:    z.string().optional(),
  min_rental_months: z.coerce.number().int().min(1).max(24).optional().or(z.literal('')),
});

const step4Schema = z.object({
  amenities:        z.array(z.string()).optional(),
  accepts_animals:  z.boolean(),
  accepts_smokers:  z.boolean(),
  accepts_students: z.boolean(),
  charges_included: z.array(z.string()).optional(),
});

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema, step4Schema];
const STEP_LABELS = ['Informations', 'Localisation', 'Détails', 'Équipements', 'Photos', 'Récapitulatif'];

// ── Étape 1 ──────────────────────────────────────────────
const Step1 = ({ form }) => {
  const { register, formState: { errors }, setValue, watch } = form;
  const selectedType = watch('type');

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Type de bien <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue('type', t.value)}
              className={`
                p-3 rounded-lg border-2 text-sm text-center transition-all
                ${selectedType === t.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
        {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
      </div>
      <Input label="Titre de l'annonce" name="title" placeholder="Ex: Appartement 3P au centre de Yaoundé" register={register} error={errors.title?.message} required />
      <Textarea label="Description" name="description" placeholder="Décrivez votre bien (situation, état, environs...)" rows={5} register={register} error={errors.description?.message} required />
    </div>
  );
};

// ── Étape 2 ──────────────────────────────────────────────
const Step2 = ({ form }) => {
  const { register, formState: { errors } } = form;
  return (
    <div className="space-y-4">
      <Input label="Adresse" name="address" placeholder="123 Rue des Palmiers" register={register} error={errors.address?.message} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Ville <span className="text-red-500">*</span>
          </label>
          <select
            {...register('city')}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Sélectionner une ville</option>
            {CITIES_CAMEROUN.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
        </div>
        <Input label="Quartier" name="neighborhood" placeholder="Ex: Bastos, Akwa..." register={register} error={errors.neighborhood?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Latitude (optionnel)" name="latitude" type="number" step="any" placeholder="3.8667" register={register} error={errors.latitude?.message} />
        <Input label="Longitude (optionnel)" name="longitude" type="number" step="any" placeholder="11.5167" register={register} error={errors.longitude?.message} />
      </div>
      <p className="text-xs text-gray-500">La latitude et longitude permettent d'afficher votre bien sur la carte.</p>
    </div>
  );
};

// ── Étape 3 ──────────────────────────────────────────────
const Step3 = ({ form }) => {
  const { register, formState: { errors } } = form;
  return (
    <div className="space-y-4">
      <Input label="Loyer mensuel (FCFA)" name="price" type="number" placeholder="150 000" register={register} error={errors.price?.message} required />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input label="Surface (m²)" name="surface" type="number" placeholder="75" register={register} error={errors.surface?.message} />
        <Input label="Nombre de pièces" name="rooms" type="number" placeholder="3" register={register} error={errors.rooms?.message} />
        <Input label="Étage" name="floor" type="number" placeholder="0" register={register} error={errors.floor?.message} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Caution (FCFA)" name="deposit_amount" type="number" placeholder="300 000" register={register} error={errors.deposit_amount?.message} />
        <Input label="Durée minimale (mois)" name="min_rental_months" type="number" placeholder="6" register={register} error={errors.min_rental_months?.message} />
      </div>
      <Input label="Disponible à partir du" name="available_from" type="date" lang="fr-FR" register={register} error={errors.available_from?.message} />
    </div>
  );
};

// ── Étape 4 ──────────────────────────────────────────────
const Step4 = ({ form }) => {
  const { watch, setValue, formState: { errors } } = form;
  const amenities = watch('amenities') || [];
  const chargesIncluded = watch('charges_included') || [];
  const acceptsAnimals = watch('accepts_animals');
  const acceptsSmokers = watch('accepts_smokers');
  const acceptsStudents = watch('accepts_students');

  const toggleItem = (field, value) => {
    const current = form.getValues(field) || [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setValue(field, updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Équipements</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => toggleItem('amenities', a.value)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-colors ${
                amenities.includes(a.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Charges incluses</p>
        <div className="flex flex-wrap gap-2">
          {CHARGES_INCLUDED.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => toggleItem('charges_included', c.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                chargesIncluded.includes(c.value)
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Règles</p>
        <div className="space-y-2">
          {[
            { field: 'accepts_animals',  label: 'Animaux de compagnie acceptés', value: acceptsAnimals },
            { field: 'accepts_smokers',  label: 'Fumeurs acceptés',              value: acceptsSmokers },
            { field: 'accepts_students', label: 'Étudiants acceptés',            value: acceptsStudents },
          ].map(({ field, label, value }) => (
            <label key={field} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => setValue(field, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Étape 5 : Photos ──────────────────────────────────────
const Step5 = ({ images, setImages, existingImages, imageManager }) => (
  <div className="space-y-4">
    {existingImages?.length > 0 && imageManager && (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Photos actuelles</p>
        {imageManager}
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {existingImages?.length > 0 ? 'Ajouter des photos' : 'Photos'}
        <span className="text-red-500 ml-1">*</span>
      </p>
      <ImageDropzone
        onFilesAdded={setImages}
        initialFiles={images}
        maxFiles={10}
        currentCount={existingImages?.length || 0}
      />
      {existingImages?.length === 0 && images.length === 0 && (
        <p className="text-xs text-red-600 mt-1">Au moins une photo est requise.</p>
      )}
    </div>
  </div>
);

// ── Étape 6 : Récapitulatif ───────────────────────────────
const Step6 = ({ data }) => (
  <div className="space-y-4">
    <p className="text-sm text-gray-600">Vérifiez les informations avant de soumettre.</p>
    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-500">Titre :</span>
          <p className="font-medium">{data.title || '—'}</p>
        </div>
        <div>
          <span className="text-gray-500">Type :</span>
          <p className="font-medium">{data.type || '—'}</p>
        </div>
        <div>
          <span className="text-gray-500">Loyer :</span>
          <p className="font-medium">{data.price ? formatPrice(data.price) : '—'}</p>
        </div>
        <div>
          <span className="text-gray-500">Ville :</span>
          <p className="font-medium">{data.city || '—'}</p>
        </div>
        <div>
          <span className="text-gray-500">Adresse :</span>
          <p className="font-medium">{data.address || '—'}</p>
        </div>
        <div>
          <span className="text-gray-500">Surface :</span>
          <p className="font-medium">{data.surface ? `${data.surface} m²` : '—'}</p>
        </div>
      </div>
    </div>
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
      <p className="text-sm text-orange-800">
        <strong>Note :</strong> Votre annonce sera soumise à validation par un administrateur avant d'être publiée.
      </p>
    </div>
  </div>
);

// ── Composant principal ───────────────────────────────────
const PropertyFormSteps = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  existingImages = [],
  imageManager = null,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '', title: '', description: '',
    address: '', city: '', neighborhood: '', latitude: '', longitude: '',
    price: '', surface: '', rooms: '', floor: '', deposit_amount: '', available_from: '', min_rental_months: '',
    amenities: [], accepts_animals: false, accepts_smokers: false, accepts_students: true, charges_included: [],
    ...initialData,
  });
  const [images, setImages] = useState([]);

  const form = useForm({
    resolver: currentStep < 4 ? zodResolver(STEP_SCHEMAS[currentStep]) : undefined,
    defaultValues: formData,
  });

  const handleNext = async () => {
    if (currentStep === 4) {
      // Photos step — require at least one photo before proceeding
      if (existingImages.length === 0 && images.length === 0) return;
      setCurrentStep((s) => s + 1);
      return;
    }
    if (currentStep > 4) {
      setCurrentStep((s) => s + 1);
      return;
    }
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    const values = form.getValues();
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const allData = { ...formData, ...form.getValues() };
    if (existingImages.length === 0 && images.length === 0) return;
    try {
      await onSubmit({ data: allData, images });
    } catch {
      // L'erreur est affichée par la page parente (CreatePropertyPage / EditPropertyPage)
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Étape {currentStep + 1} sur {STEP_LABELS.length}</span>
          <span>{STEP_LABELS[currentStep]}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-1">
          {STEP_LABELS.map((label, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{STEP_LABELS[currentStep]}</h3>
        {currentStep === 0 && <Step1 form={form} />}
        {currentStep === 1 && <Step2 form={form} />}
        {currentStep === 2 && <Step3 form={form} />}
        {currentStep === 3 && <Step4 form={form} />}
        {currentStep === 4 && (
          <Step5
            images={images}
            setImages={setImages}
            existingImages={existingImages}
            imageManager={imageManager}
          />
        )}
        {currentStep === 5 && <Step6 data={{ ...formData, ...form.getValues() }} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>

        {currentStep < STEP_LABELS.length - 1 ? (
          <Button type="button" variant="primary" onClick={handleNext}>
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={existingImages.length === 0 && images.length === 0}
          >
            <Check className="h-4 w-4" />
            Soumettre l'annonce
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyFormSteps;
