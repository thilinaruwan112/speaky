import { getScenarioById, Scenario } from '@/lib/scenarios';
import PracticePageClient from '@/components/PracticePageClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ScenarioPageProps {
  params: {
    id: string;
  };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const scenario = getScenarioById(params.id);

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Scenario Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The scenario you are looking for does not exist or could not be loaded.
        </p>
        <Link href="/" passHref legacyBehavior>
          <Button>Back to Scenarios</Button>
        </Link>
      </div>
    );
  }

  return <PracticePageClient scenario={scenario} />;
}

// This function can be used if you want to statically generate scenario pages at build time
// For dynamic rendering (on-demand), this is not strictly necessary with App Router
export async function generateStaticParams() {
  const { scenarios } = await import('@/lib/scenarios');
  return scenarios.map((scenario) => ({
    id: scenario.id,
  }));
}
