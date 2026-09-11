import React, { useState } from 'react';
import { useTickets } from '../../../context/TicketContext';
import { Modal } from '../../common/Modal';
import { Input, Textarea } from '../../common/Input';
import { Button } from '../../common/Button';
import { PlusCircle, User, Mail, FileText, Tag, AlertTriangle } from 'lucide-react';

export function CreateTicketModal({ isOpen, onClose }) {
  const { createTicket, isLoading } = useTickets();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCompany: '',
    subject: '',
    category: 'Technical',
    priority: 'Medium',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      errs.customerName = 'Name must be at least 2 characters';
    }

    if (!formData.customerEmail.trim()) {
      errs.customerEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      errs.customerEmail = 'Please provide a valid email address';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Issue title is required';
    } else if (formData.subject.trim().length < 5) {
      errs.subject = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Detailed description is required';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Please provide at least 15 characters of detail';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTicket(formData);
      // Reset form state on successful creation
      setFormData({
        customerName: '',
        customerEmail: '',
        customerCompany: '',
        subject: '',
        category: 'Technical',
        priority: 'Medium',
        description: '',
      });
      setErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Support Ticket"
      description="Log a new customer request or internal issue directly into the support pipeline."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Customer Name"
            placeholder="e.g. Amit Sharma"
            required
            icon={User}
            value={formData.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            error={errors.customerName}
          />
          <Input
            label="Customer Email"
            type="email"
            placeholder="e.g. amit@example.com"
            required
            icon={Mail}
            value={formData.customerEmail}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
            error={errors.customerEmail}
          />
        </div>

        {/* Company & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-1">
            <Input
              label="Company / Domain"
              placeholder="e.g. Acme Corp"
              value={formData.customerCompany}
              onChange={(e) => handleChange('customerCompany', e.target.value)}
            />
          </div>

          <div className="sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-dark-text text-xs rounded-xl border border-slate-200 dark:border-dark-border px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            >
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full bg-white dark:bg-slate-900/90 text-slate-900 dark:text-dark-text text-xs rounded-xl border border-slate-200 dark:border-dark-border px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Subject */}
        <Input
          label="Issue Title"
          placeholder="e.g. Cannot reset my password"
          required
          icon={FileText}
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          error={errors.subject}
        />

        {/* Description */}
        <Textarea
          label="Detailed Description"
          placeholder="Describe the problem, steps to reproduce, or client inquiry in detail..."
          required
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          helperText="Include any relevant error codes, URLs, or browser environments."
        />

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            icon={PlusCircle}
          >
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
