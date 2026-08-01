import { useEffect, useState } from 'react';
import { Eye, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { toast } from 'sonner';

interface Message {
  _id: string;
  fullName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const result = await res.json();
        setMessages(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchMessages();
        toast.success('Message marked as read');
        if (viewMessage && viewMessage._id === id) {
          setViewMessage({ ...viewMessage, status: 'read' });
        }
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchMessages();
        setViewMessage(null);
        toast.success('Message deleted');
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openMessage = (msg: Message) => {
    setViewMessage(msg);
    if (msg.status === 'unread') {
      handleMarkAsRead(msg._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Contact Messages</h2>
          <p className="text-muted-foreground">Review and manage inquiries from the public website.</p>
        </div>
      </div>

      <Dialog open={!!viewMessage} onOpenChange={(open) => !open && setViewMessage(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold block">From:</span>
                  <span>{viewMessage.fullName}</span>
                </div>
                <div>
                  <span className="font-semibold block">Email:</span>
                  <a href={`mailto:${viewMessage.email}`} className="text-primary hover:underline">{viewMessage.email}</a>
                </div>
                <div>
                  <span className="font-semibold block">Company:</span>
                  <span>{viewMessage.company || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold block">Date:</span>
                  <span>{new Date(viewMessage.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <span className="font-semibold block mb-2">Subject: {viewMessage.subject || 'No Subject'}</span>
                <p className="whitespace-pre-wrap text-muted-foreground bg-muted p-4 rounded-md text-sm">
                  {viewMessage.message}
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="destructive" onClick={() => handleDelete(viewMessage._id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Sender</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading messages...</td></tr>
                ) : messages.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No messages found.</td></tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id} className={`border-b last:border-0 hover:bg-muted/30 ${msg.status === 'unread' ? 'bg-muted/10 font-medium' : ''}`}>
                      <td className="px-6 py-4">
                        {msg.status === 'unread' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Unread
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-muted-foreground">
                            Read
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{msg.fullName}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{msg.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="truncate max-w-[200px]">{msg.subject || 'No Subject'}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openMessage(msg)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(msg._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
