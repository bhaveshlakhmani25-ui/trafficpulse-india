import CommandCenterLayout from '../components/dashboard/CommandCenterLayout';
import { CityProvider } from '../lib/contexts/CityContext';

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden bg-gray-950">
      <CityProvider>
        <CommandCenterLayout />
      </CityProvider>
    </main>
  );
}
