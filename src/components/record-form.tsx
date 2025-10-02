"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

import { getData } from "country-list";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Record } from "./data-table";

interface FormData {
  country: string;
  accountType: string;
  username: string;
  lastName: string;
  firstName: string;
  email: string;
  contactNumber: string;
  photo: File | null;
}

export default function RecordForm({
  onSuccess,
  record,
}: {
  onSuccess?: () => void;
  record?: Record;
}) {
  const [formData, setFormData] = useState<FormData>({
    country: record?.country || "",
    accountType: record?.accountType || "",
    username: record?.username || "",
    lastName: record?.lastName || "",
    firstName: record?.firstName || "",
    email: record?.email || "",
    contactNumber: record?.contactNumber?.toString() || "",
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    record?.photoUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("country", formData.country);
    submitData.append("accountType", formData.accountType);
    submitData.append("username", formData.username);
    submitData.append("lastName", formData.lastName);
    submitData.append("firstName", formData.firstName);
    submitData.append("email", formData.email);
    submitData.append("contactNumber", formData.contactNumber);
    if (record?.photoUrl) {
      submitData.append("existingPhotoUrl", record.photoUrl);
    }
    if (formData.photo) {
      submitData.append("photo", formData.photo);
    }

    try {
      const url = record ? `/api/record/${record._id}` : "/api/record";
      const method = record ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        if (!record) {
          setFormData({
            country: "",
            accountType: "",
            username: "",
            lastName: "",
            firstName: "",
            email: "",
            contactNumber: "",
            photo: null,
          });
          setPreviewUrl(null);
        }
        if (onSuccess) onSuccess();
        toast.success(
          record
            ? "Record updated successfully!"
            : "Record submitted successfully!"
        );
      } else {
        toast.error("Submission failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, country: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {getData().map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="accountType"
            className="block text-sm font-medium text-gray-700"
          >
            Account Type
          </label>
          <Select
            value={formData.accountType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, accountType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Account Type</SelectLabel>
                <SelectItem value="Team Member">Team Member</SelectItem>
                <SelectItem value="Team Leader">Team Leader</SelectItem>
                <SelectItem value="project manager">Project Manager</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            required
            type="tel"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactNumber: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="photo">Photo (optional)</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData((prev) => ({ ...prev, photo: file }));
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      {previewUrl && (
        <div className="mt-6">
          <img
            src={previewUrl as string}
            alt="Profile"
            className="mt-2 w-32 h-32 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
