
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from '@/hooks/useTeamMembers';

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember;
  onSave: (member: Partial<TeamMember>) => void;
  onDelete?: (memberId: string) => void;
  onDeactivate?: (memberId: string) => void;
}

export const TeamMemberDialog = ({ 
  open, 
  onOpenChange, 
  member, 
  onSave, 
  onDelete, 
  onDeactivate 
}: TeamMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'Developer',
    department: member?.department || 'Engineering',
    phone: member?.phone || '',
    salary: member?.salary || 0,
    status: member?.status || 'Active'
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (member && onDelete) {
      onDelete(member.id);
      onOpenChange(false);
    }
  };

  const handleDeactivate = () => {
    if (member && onDeactivate) {
      onDeactivate(member.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update team member information' : 'Add a new team member to your organization'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@company.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                <SelectItem value="Business Analyst">Business Analyst</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              placeholder="50000"
            />
          </div>
          {member && (
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'Active' | 'Inactive' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            {member && onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            {member && onDeactivate && formData.status === 'Active' && (
              <Button variant="outline" onClick={handleDeactivate}>
                Deactivate
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {member ? 'Update' : 'Add'} Member
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
