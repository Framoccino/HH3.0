import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-4">{task.title}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          {task.location}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          {task.duration}
        </div>
      </div>
      <p className="text-gray-600 mb-6">{task.description}</p>
      <Link href={`/tasks/${task.id}`}>
        <Button className="w-full bg-primary hover:bg-primary/90">Learn More</Button>
      </Link>
    </div>
  );
} 