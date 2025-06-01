import type { Scenario } from '@/lib/scenarios';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const IconComponent = scenario.icon;
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <IconComponent className="w-10 h-10 text-primary" />
        <div>
          <CardTitle className="font-headline text-xl">{scenario.title}</CardTitle>
          <CardDescription>{scenario.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Link href={`/scenario/${scenario.id}`} passHref legacyBehavior>
          <Button variant="default" className="w-full mt-auto">
            Start Practice <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
