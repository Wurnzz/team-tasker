
import { Task } from "@/types/task";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const getPriorityColor = (priority: Task["priority"]) => {
    const colors = {
      Low: "bg-priority-low",
      Medium: "bg-priority-medium",
      High: "bg-priority-high",
    };
    return colors[priority];
  };

  const getStatusColor = (status: Task["status"]) => {
    const colors = {
      "Done": "bg-status-done",
      "In progress": "bg-status-in-progress",
      "To do": "bg-status-to-do",
      "Pending Review": "bg-status-pending-review",
    };
    return colors[status];
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-gray-500">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="animate-slide-in">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge
                className={`${getPriorityColor(
                  task.priority
                )} text-white`}
              >
                {task.priority}
              </Badge>
              <Badge
                className={`${getStatusColor(task.status)} text-white`}
              >
                {task.status}
              </Badge>
            </div>
            <CardTitle className="line-clamp-2">{task.description}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {format(task.deadline, "PP")}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Client</p>
                      <p className="text-sm text-gray-600">{task.client}</p>
                    </div>
                    {task.pageLink && (
                      <div>
                        <p className="font-medium">Page Link</p>
                        <a
                          href={task.pageLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                        >
                          <Link size={14} />
                          Visit Page
                        </a>
                      </div>
                    )}
                    {task.notes && (
                      <div>
                        <p className="font-medium">Notes</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {task.notes}
                        </p>
                      </div>
                    )}
                    {task.clientDiscussion && (
                      <div>
                        <p className="font-medium">Client Discussion Points</p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {task.clientDiscussion}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
