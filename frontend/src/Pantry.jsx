import { useEffect, useState } from 'react';
import { supabase } from './supabaseclient';

function Pantry() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .order('expiry_date');

    if (error) console.error(error);
    else setItems(data);
  };

  const markConsumed = async (id) => {
    await supabase
      .from('pantry_items')
      .update({ consumed: true })
      .eq('id', id);
    fetchItems(); // refresh
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getStatus = (item) => {
    if (item.consumed) return 'text-gray-400';
    const daysLeft = (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 1) return 'text-red-500';
    if (daysLeft < 3) return 'text-yellow-500';
    return 'text-green-600';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Your Pantry</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={`flex justify-between ${getStatus(item)}`}>
            <span>{item.name} — {item.expiry_date}</span>
            {!item.consumed && (
              <button
                onClick={() => markConsumed(item.id)}
                className="text-sm text-blue-500 underline"
              >
                Mark as used
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pantry;
// This component fetches pantry items from Supabase, displays them, and allows marking items as consumed.