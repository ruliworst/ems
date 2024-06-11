"use client";

import "reflect-metadata";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OperatorApiService } from "@/src/infrastructure/api/services/operators/OperatorApiService";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/;

const registerOperatorFormSchema = z.object({
  firstName: z.string()
    .min(2, { message: "The first name must contain at least 2 characters." })
    .max(50)
    .regex(nameRegex, { message: "The first name cannot contain numbers." }),
  firstSurname: z.string()
    .min(2, { message: "The first surname must contain at least 2 characters." })
    .max(50)
    .regex(nameRegex, { message: "The first surname cannot contain numbers." }),
  secondSurname: z.union([
    z.string()
      .min(2, { message: "The second surname must contain at least 2 characters." })
      .max(50)
      .regex(nameRegex, { message: "The second surname cannot contain numbers." }),
    z.string().length(0)
  ]).optional(),
  email: z.string().email(),
  password: z.string().min(4, { message: "The password must contain at least 4 characters." }),
  confirmPassword: z.string().min(4, { message: "The password must contain at least 4 characters." }),
  phoneNumber: z.string().regex(
    /^\d{9}$/,
    { message: "The only valid format is the Spanish format so, the phone number must have 9 digits." }
  ),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

export default function RegisterOperatorView() {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(registerOperatorFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      firstSurname: "",
      secondSurname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: ""
    },
  });

  const onSubmit = async (values: any) => {
    const { confirmPassword, ...createOperatorDTO } = values;
    await OperatorApiService.create(createOperatorDTO)
      .then(email => {
        toast({
          title: `Operator with email ${email} created`,
          description: `${new Date().toLocaleString()}`
        });
        form.reset();
      });
  };

  return (
    <>
      <div className="bg-gray-100 p-6 h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Register Operator</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-black">Dereck Wilson</span>
              <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col bg-white rounded-lg shadow p-6 w-1/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="firstSurname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Surname</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="secondSurname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Second Surname</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="w-1/4" disabled={!form.formState.isValid}>Register</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
