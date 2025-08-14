"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface StartPageProps {
  onStartQuiz: (email: string) => void;
  isLoading?: boolean;
}

export function StartPage({ onStartQuiz, isLoading = false }: StartPageProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    setInternalLoading(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    onStartQuiz(data.email);
    setInternalLoading(false);
  };

  const isFormLoading = isLoading || internalLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to the Quiz!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Test your knowledge with our interactive quiz. You'll have 30 minutes to answer 15 questions.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        disabled={isFormLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isFormLoading}
              >
                {isFormLoading ? "Starting Quiz..." : "Start Quiz"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2 font-medium">Quiz Rules:</p>
            <ul className="space-y-1 text-left">
              <li>• 15 questions total</li>
              <li>• 30 minutes time limit</li>
              <li>• Multiple choice questions</li>
              <li>• You can navigate between questions</li>
              <li>• Quiz auto-submits when time runs out</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
