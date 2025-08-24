import { PlantInfoType } from '@/types/types';

interface TableProps {
  info: PlantInfoType;
}

export default function Table({ info }: TableProps) {
  const excludeKeys = ['description', 'careInstructions'];
  const entries = Object.entries(info)
    .filter(([key, value]) => 
      !excludeKeys.includes(key) && 
      value !== undefined && 
      value !== null && 
      value !== ''
    );

  if (entries.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-lg">
        No additional details available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="divide-y divide-gray-200">
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-lg text-foreground">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}