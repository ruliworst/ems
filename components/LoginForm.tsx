'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "The password must contain at least 4 characters." }),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const onSubmit = async (values: any) => {
    const { email, password } = values;
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    console.log({ response });
    if (!response?.error) {
      router.push('/');
      router.refresh();
    }

    form.reset();
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center w-3/12 bg-gray-100 p-6 rounded-lg">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xl'>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className='text-md' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xl'>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className='text-md' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="w-1/4" disabled={!form.formState.isValid}>Login</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}