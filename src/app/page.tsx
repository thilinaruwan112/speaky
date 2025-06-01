import { scenarios } from '@/lib/scenarios';
import { ScenarioCard } from '@/components/ScenarioCard';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-primary flex items-center justify-center">
          <Sparkles className="w-12 h-12 mr-3 text-amber-400" />
          SpeakEasy Practice
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Choose a scenario below to start practicing your spoken English.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
      <footer className="text-center mt-16 py-8 border-t">
        <p className="text-muted-foreground">
          Improve your English, one conversation at a time.
        </p>
      </footer>
    </main>
  );
}
