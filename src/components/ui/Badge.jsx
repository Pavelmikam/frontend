const roleConfig = {
  locataire:    { label: 'Locataire',    classes: 'bg-blue-100 text-blue-700' },
  proprietaire: { label: 'Propriétaire', classes: 'bg-green-100 text-green-700' },
  admin:        { label: 'Admin',        classes: 'bg-purple-100 text-purple-700' },
};

const Badge = ({ role }) => {
  const config = roleConfig[role] || { label: role, classes: 'bg-gray-100 text-gray-700' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default Badge;
