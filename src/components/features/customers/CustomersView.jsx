import React, { useState } from 'react';
import { useTickets } from '../../../context/TicketContext';
import { Avatar } from '../../common/Avatar';
import { Button } from '../../common/Button';
import { Search, Mail, Building2, Ticket } from 'lucide-react';

export function CustomersView({ onSelectCustomerTickets }) {
  const { customers, setSearchQuery, setStatusFilter } = useTickets();
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const viewCustomerTickets = (customerName) => {
    setSearchQuery(customerName);
    setStatusFilter('All');
    onSelectCustomerTickets?.();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-5 rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark transition-colors duration-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-dark-text">Customers Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active clients, tier levels, and open support engagement counts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search customers by name, company..."
            className="w-full bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-900 dark:text-dark-text rounded-xl border border-slate-200 dark:border-dark-border pl-9 pr-3 py-2 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-slate-200/80 dark:border-dark-border shadow-xs dark:shadow-card-dark overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-dark-border text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Open Issues</th>
                <th className="px-5 py-3">Total Tickets</th>
                <th className="px-5 py-3">Last Active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-surface-hover transition-colors duration-150">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.name} size="md" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-dark-text">{customer.name}</div>
                        <div className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{customer.company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        customer.status === 'Enterprise'
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                          : customer.status === 'Pro'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {customer.openTickets > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800/60">
                        {customer.openTickets} Open
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-[11px]">None</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    {customer.totalTickets}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 text-[11px]">
                    {customer.lastActive}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewCustomerTickets(customer.name)}
                      icon={Ticket}
                    >
                      View Tickets
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
