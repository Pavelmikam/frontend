import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const SortableImage = ({ image, onDelete, onSetPrimary, isDeleting, isSettingPrimary }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 border border-gray-200">
      <img
        src={image.thumbnail_url || image.optimized_url}
        alt={image.original_name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-white/80 rounded p-0.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Déplacer"
      >
        <GripVertical className="h-4 w-4 text-gray-600" />
      </button>

      {image.is_primary && (
        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
          Principale
        </span>
      )}

      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!image.is_primary && (
          <button
            type="button"
            onClick={() => onSetPrimary(image.id)}
            disabled={isSettingPrimary}
            className="bg-white/80 rounded p-0.5 hover:bg-yellow-100"
            title="Définir comme principale"
          >
            <Star className="h-4 w-4 text-yellow-500" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          className="bg-white/80 rounded p-0.5 hover:bg-red-100"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

const ImageReorderGrid = ({ images = [], propertyId, onReorder, onDelete, onSetPrimary, isDeleting, isSettingPrimary }) => {
  const [items, setItems] = useState(images.map((img) => img.id));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);

    const orderedImages = newOrder.map((id, index) => ({ id, order: index }));
    onReorder(orderedImages);
  };

  const sortedImages = items
    .map((id) => images.find((img) => img.id === id))
    .filter(Boolean);

  if (!images.length) {
    return <p className="text-sm text-gray-500 text-center py-4">Aucune photo disponible.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {sortedImages.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onDelete={onDelete}
              onSetPrimary={onSetPrimary}
              isDeleting={isDeleting}
              isSettingPrimary={isSettingPrimary}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ImageReorderGrid;
