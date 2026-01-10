import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Key, Bell, Shield, Trash2 } from 'lucide-react';

const teamMembers = [
  { id: '1', name: 'Admin User', email: 'admin@gmail.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Demo User', email: 'user@gmail.com', role: 'User', status: 'Active' },
  { id: '3', name: 'John Smith', email: 'john@company.com', role: 'User', status: 'Active' },
  { id: '4', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'User', status: 'Pending' },
];

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    reports: true,
    alerts: false,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization and application settings
        </p>
      </div>

      {/* Organization Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="text-primary" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Organization</CardTitle>
              <CardDescription>Manage your organization details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue={user?.organization} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" defaultValue={user?.region} />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <CardTitle className="text-lg font-medium">Team Members</CardTitle>
                <CardDescription>Manage who has access to your organization</CardDescription>
              </div>
            </div>
            <Button>Invite Member</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      member.status === 'Active'
                        ? 'border-green-200 text-green-700 bg-green-50'
                        : 'border-orange-200 text-orange-700 bg-orange-50'
                    }
                  >
                    {member.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Key className="text-orange-600" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">API Keys</CardTitle>
              <CardDescription>Manage your API access credentials</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Production API Key</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  tk_prod_••••••••••••••••••••
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Copy</Button>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Development API Key</p>
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  tk_dev_••••••••••••••••••••
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Copy</Button>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Bell className="text-purple-600" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Report Ready Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when reports are generated</p>
            </div>
            <Switch
              checked={notifications.reports}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, reports: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Stock Alerts</p>
              <p className="text-sm text-muted-foreground">Receive low stock warnings</p>
            </div>
            <Switch
              checked={notifications.alerts}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, alerts: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="text-red-600" size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Security</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
            </div>
            <Badge variant="secondary">30 minutes</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
