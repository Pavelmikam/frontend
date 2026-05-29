import { AMENITIES, CHARGES_INCLUDED } from '@/utils/constants';

const PropertyAmenitiesGrid = ({ amenities = [], chargesIncluded = [] }) => {
  if (!amenities.length && !chargesIncluded.length) return null;

  return (
    <div className="space-y-4">
      {amenities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Équipements</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.map((value) => {
              const amenity = AMENITIES.find((a) => a.value === value);
              if (!amenity) return null;
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm"
                >
                  <span>{amenity.icon}</span>
                  {amenity.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {chargesIncluded.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Charges incluses</h4>
          <div className="flex flex-wrap gap-2">
            {chargesIncluded.map((value) => {
              const charge = CHARGES_INCLUDED.find((c) => c.value === value);
              if (!charge) return null;
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm"
                >
                  {charge.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyAmenitiesGrid;
