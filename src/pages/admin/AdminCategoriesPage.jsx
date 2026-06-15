import { useState } from 'react';
import { Plus, Pencil, PowerOff, Power } from 'lucide-react';
import { useAdminCategories, useAdminCategoryMutations } from '@/hooks/useAdminCategories';
import CategoryForm from '@/components/admin/CategoryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const TABS = [
  { key: 'property_type', label: 'Types de biens' },
  { key: 'amenity',       label: 'Équipements'    },
  { key: 'charge',        label: 'Charges'        },
];

const AdminCategoriesPage = () => {
  const [category, setCategory] = useState('property_type');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const { data, isLoading } = useAdminCategories({ category });
  const { create, update, disable } = useAdminCategoryMutations();

  const items = data?.data ?? [];

  const handleCreate = (data) => {
    create.mutate(data, { onSuccess: () => setFormOpen(false) });
  };

  const handleUpdate = (data) => {
    update.mutate({ id: editTarget.id, data }, { onSuccess: () => setEditTarget(null) });
  };

  const handleToggle = (item) => {
    if (item.is_active) {
      disable.mutate(item.id);
    } else {
      update.mutate({ id: item.id, data: { is_active: true } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Équipements & Catégories</h1>
        <Button variant="primary" onClick={() => setFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-full sm:w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              category === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucune entrée trouvée.</div>
        ) : (
          <table className="w-full min-w-[480px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Label', 'Valeur (slug)', 'Ordre', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.label}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    {item.is_active ? (
                      <span className="text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">Actif</span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">Inactif</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditTarget(item)}
                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleToggle(item)}
                        className={`p-1.5 rounded transition-colors ${
                          item.is_active
                            ? 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                            : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                        }`}
                        title={item.is_active ? 'Désactiver' : 'Réactiver'}
                      >
                        {item.is_active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Ajouter une catégorie">
        <CategoryForm
          onSubmit={handleCreate}
          isLoading={create.isPending}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Modifier la catégorie">
        <CategoryForm
          initialData={editTarget}
          onSubmit={handleUpdate}
          isLoading={update.isPending}
          onCancel={() => setEditTarget(null)}
        />
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
