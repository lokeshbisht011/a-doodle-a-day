"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function DailyPromptManager() {
  const [prompts, setPrompts] = useState([]);
  const [form, setForm] = useState({
    prompt: "",
    promptDescription: "",
    promptDate: "",
  });
  const [editingId, setEditingId] = useState(null)

  // Fetch prompts
  const fetchPrompts = async () => {
    const res = await fetch("/api/daily-prompts");
    const data = await res.json();
    setPrompts(data);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  // Save (Add or Update)
  const handleSubmit = async () => {
    if (!form.prompt || !form.promptDate) {
      toast.error("Prompt and date are required");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/daily-prompts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Prompt updated ✅");
      } else {
        // Create
        const res = await fetch("/api/daily-prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Creation failed");
        toast.success("Prompt added 🎉");
      }

      setForm({ prompt: "", promptDescription: "", promptDate: "" });
      setEditingId(null);
      fetchPrompts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save prompt");
    }
  };

  // Start editing
  const handleEdit = (p) => {
    setForm({
      prompt: p.prompt,
      promptDescription: p.promptDescription,
      promptDate: p.promptDate.split("T")[0],
    });
    setEditingId(p.id);
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold">Daily Prompt Manager</h2>

      {/* Form */}
      <div className="space-y-4">
        <Input
          placeholder="Prompt"
          value={form.prompt}
          onChange={(e) => setForm({ ...form, prompt: e.target.value })}
        />
        <Textarea
          placeholder="Prompt Description"
          value={form.promptDescription}
          onChange={(e) =>
            setForm({ ...form, promptDescription: e.target.value })
          }
        />
        <Input
          type="date"
          value={form.promptDate}
          onChange={(e) => setForm({ ...form, promptDate: e.target.value })}
        />
        <Button onClick={handleSubmit}>
          {editingId ? "Update Prompt" : "Add Prompt"}
        </Button>
      </div>

      {/* Prompt Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prompt</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.prompt}</TableCell>
              <TableCell>{p.promptDescription}</TableCell>
              <TableCell>
                {new Date(p.promptDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
