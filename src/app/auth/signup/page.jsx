'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { authAPI } from '@apiManager/authAPI';
import Link from 'next/link';
import Notification from '@components/notification';
import GoogleAuthButton from '@components/googleAuthBtn';
import { useTranslation } from '@lib/translation/useTranslation';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  });
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Notification({message: 'Passwords do not match'});
      return;
    }
    
    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await authAPI.signup(signupData);
      if (response.error) {
        return Notification({ message: response.error || 'Something went wrong' });
      }
      localStorage.setItem('token', response.data.token);
      Notification({ type:'success', message: 'Account created successfully. Please login.', background: 'green', duration: 5000 });
      router.push('/');
    } catch (error) {
      Notification({ message: 'Signup failed due to technical issue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle> {t('create_account')} </CardTitle>
          <CardDescription>{t('signup_prompt')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('full_name')}</Label>
              <Input
                id="name"
                placeholder={t('enter_full_name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enter_email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">{t('mobile_number')} ({t('optional')})</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder={t('enter_mobile_number')}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('create_password')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('confirm_password')}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('creating_account') : t('sign_up')}
            </Button>
          </form>
          <GoogleAuthButton signup={true} />
            <p className="text-center text-sm text-gray-600 mt-4">
              {t('already_have_account')}{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                {t('login')}
              </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}