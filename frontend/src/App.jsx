import { createClient } from '@supabase/supabase-js';
import Pantry from './Pantry';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">FoodTech Platform</h1>
      <Pantry />
    </div>
  );
}

export default App;