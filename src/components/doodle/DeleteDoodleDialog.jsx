// components/DeleteDoodleDialog.jsx

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const DeleteDoodleDialog = ({ isOpen, onOpenChange, doodleId, onDoodleDeleted }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/doodles/${doodleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Doodle deleted",
          description: "The doodle was successfully removed.",
        });
        if (onDoodleDeleted) {
          onDoodleDeleted(doodleId);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete doodle. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Failed to delete doodle.",
        variant: "destructive",
      });
      console.error("Error deleting doodle:", err);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this doodle? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDoodleDialog;