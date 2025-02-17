
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
import { Calendar, Link, User, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const getPriorityColor = (priority: Task["priority"]) => {
    const colors = {
      Low: "bg-blue-500 hover:bg-blue-600",
      Medium: "bg-yellow-500 hover:bg-yellow-600",
      High: "bg-red-500 hover:bg-red-600",
    };
    return colors[priority];
  };

  const getStatusColor = (status: Task["status"]) => {
    const colors = {
      "Done": "bg-green-500 hover:bg-green-600",
      "In progress": "bg-purple-500 hover:bg-purple-600",
      "To do": "bg-gray-500 hover:bg-gray-600",
      "Pending Review": "bg-orange-500 hover:bg-orange-600",
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={cn(
            "animate-slide-in",
            "transition-all duration-200 hover:shadow-lg",
            "border-l-4",
            task.priority === "High" ? "border-l-red-500" : 
            task.priority === "Medium" ? "border-l-yellow-500" : 
            "border-l-blue-500"
          )}
        >
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start gap-2">
              <Badge
                className={`${getPriorityColor(task.priority)} text-white`}
              >
                {task.priority} Priority
              </Badge>
              <Badge
                className={`${getStatusColor(task.status)} text-white`}
              >
                {task.status}
              </Badge>
            </div>
            <div>
              <CardTitle className="line-clamp-2 mb-2">{task.description}</CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-gray-500" />
                  <span>Created by {task.taskCreator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-gray-500" />
                  <span>Requested on {format(task.dateRequested, "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <Calendar size={14} />
                  <span>Due {format(task.deadline, "PPP")}</span>
                </div>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium">
                  View Details
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Client</h4>
                      <p className="text-sm text-gray-600">{task.client}</p>
                    </div>
                    
                    {task.pageLink && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Page Link</h4>
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

                    {task.loginDetails && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Login Details</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {task.loginDetails}
                        </p>
                      </div>
                    )}

                    {task.notes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {task.notes}
                        </p>
                      </div>
                    )}

                    {task.clientDiscussion && (
                      <div className="pt-2 border-t">
                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <MessageSquare size={14} />
                          Client Discussion Points
                        </h4>
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
