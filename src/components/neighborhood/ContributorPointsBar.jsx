const LEVELS = [
  { min: 0,  max: 9,  label: 'Débutant',            next: 'Contributeur actif', threshold: 10 },
  { min: 10, max: 49, label: 'Contributeur actif',   next: 'Expert quartier',    threshold: 50 },
  { min: 50, max: Infinity, label: 'Expert quartier', next: null,                threshold: null },
];

const ContributorPointsBar = ({ points = 0 }) => {
  const level = LEVELS.find((l) => points >= l.min && points <= l.max) ?? LEVELS[0];
  const isMax = level.threshold === null;
  const pct = isMax
    ? 100
    : Math.min(((points - level.min) / (level.threshold - level.min)) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-800">{level.label}</span>
        <span className="text-blue-600 font-bold">{points} pts</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-blue-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!isMax && (
        <p className="text-xs text-gray-500">
          {level.threshold - points} pts pour atteindre <span className="font-medium">{level.next}</span>
        </p>
      )}
      {isMax && (
        <p className="text-xs text-green-600 font-medium">Niveau maximum atteint ! 🏆</p>
      )}
    </div>
  );
};

export default ContributorPointsBar;
