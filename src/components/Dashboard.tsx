
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(task => ({
        ...task,
        dateRequested: new Date(task.date_requested),
        taskCreator: task.task_creator,
        pageLink: task.page_link,
        loginDetails: task.login_details,
        clientDiscussion: task.client_discussion,
        deadline: new Date(task.deadline),
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          date_requested: task.dateRequested.toISOString(),
          task_creator: task.taskCreator,
          client: task.client,
          description: task.description,
          page_link: task.pageLink,
          login_details: task.loginDetails,
          priority: task.priority,
          deadline: task.deadline.toISOString(),
          status: task.status,
          notes: task.notes,
          client_discussion: task.clientDiscussion,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "Your task has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = (task: Task) => {
    createTaskMutation.mutate(task);
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Task Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TaskForm onSubmit={handleCreateTask} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  );
}
