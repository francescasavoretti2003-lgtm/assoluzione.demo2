'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, User, Binary, Cake, Languages, Loader2 } from 'lucide-react';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFirebase, initiateAnonymousSignIn, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Profile } from '@/lib/types';

const profileSchema = z.object({
  name: z.string().min(1, 'Name or nickname is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  age: z.coerce.number().min(1, 'Age is required.').max(150),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileCreationPage() {
  const router = useRouter();
  const { setLanguage, setProfile, language } = useAppContext();
  const { auth, firestore, user } = useFirebase();
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      gender: '',
      age: 18,
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setPhotoError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = (data: ProfileFormValues, uid: string) => {
    const profileData: Profile = {
      id: uid,
      name: data.name,
      gender: data.gender,
      age: data.age,
      photo: photo!,
      photoUrl: photo!, // Using data URI as photoUrl
      language: language,
    };
    
    // Data for the public participants collection
    const participantData = {
        id: uid,
        name: data.name,
        photoUrl: photo!,
        biggestFault: '', // Will be updated later
    };

    const profileDocRef = doc(firestore, 'users', uid, 'profile', uid);
    const participantDocRef = doc(firestore, 'participants', uid);

    setDocumentNonBlocking(profileDocRef, profileData, { merge: true });
    setDocumentNonBlocking(participantDocRef, participantData, { merge: true });

    setProfile(profileData);
    router.push('/confession');
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (!photo) {
      setPhotoError('A photo is mandatory.');
      return;
    }
    setIsSubmitting(true);
    if (!user) {
      initiateAnonymousSignIn(auth);
      // The useEffect below will handle saving the profile once the user is signed in
    } else {
      // If user is already signed in, just save the profile.
      saveProfile(data, user.uid);
    }
  };

  useEffect(() => {
    // This effect runs when the user is authenticated and the form was submitted.
    if (user && isSubmitting) {
      const values = form.getValues();
      saveProfile(values, user.uid);
    }
  }, [user, isSubmitting]);


  const isEnglish = language === 'en';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fadeIn">
      <Card className="w-full max-w-md bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold glitch">A S S O L U Z I O N E</h1>
          <p className="text-muted-foreground font-code">{isEnglish ? 'Phase 1: Confession' : 'Fase 1: Confessione'}</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4 mb-6">
            <Languages className="w-5 h-5 text-muted-foreground" />
            <Button variant={language === 'it' ? 'secondary' : 'ghost'} onClick={() => setLanguage('it')} size="sm">
              Italiano
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant={language === 'en' ? 'secondary' : 'ghost'} onClick={() => setLanguage('en')} size="sm">
              English
            </Button>
          </div>

          <p className="text-center text-muted-foreground mb-6">
            {isEnglish ? 'Create your profile to begin.' : 'Crea il tuo profilo per iniziare.'}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className={photoError ? 'text-destructive' : ''}>
                  {isEnglish ? 'Upload Photo' : 'Carica Foto'}
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                    {photo ? (
                      <img src={photo} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1" />
                </div>
                {photoError && <p className="text-sm font-medium text-destructive">{photoError}</p>}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEnglish ? 'Name / Nickname' : 'Nome / Nickname'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder={isEnglish ? 'Your identifier...' : 'Il tuo identificativo...'} {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? 'Gender' : 'Genere'}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <Binary className="w-4 h-4 text-muted-foreground mr-2" />
                            <SelectValue placeholder={isEnglish ? 'Select...' : 'Seleziona...'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="woman">{isEnglish ? 'Woman' : 'Donna'}</SelectItem>
                          <SelectItem value="man">{isEnglish ? 'Man' : 'Uomo'}</SelectItem>
                          <SelectItem value="other">{isEnglish ? 'Beyond gender binarism' : 'Oltre il binarismo di genere'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEnglish ? 'Age' : 'Età'}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="number" placeholder="25" {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (isEnglish ? 'BEGIN CONFESSION' : 'INIZIA LA CONFESSIONE')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
    