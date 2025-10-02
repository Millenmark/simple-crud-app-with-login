"use client";

import { useState, useEffect, useActionState } from "react";
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
import { Record as RecordType } from "./data-table";
import { createOrUpdateRecord } from "@/lib/record-actions";

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
  record?: RecordType;
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
  const [state, action, isPending] = useActionState(
    createOrUpdateRecord,
    undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (state?.success) {
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
      toast.success(state.message);
    } else if (state?.errors) {
      setErrors(
        Object.fromEntries(
          Object.entries(state.errors).map(([k, v]) => [
            k,
            Array.isArray(v) ? v[0] : v,
          ])
        )
      );
    }
  }, [state]);

  return (
    <div>
      <form action={action} className="space-y-4">
        {record && <input type="hidden" name="id" value={record._id} />}
        {record?.photoUrl && (
          <input
            type="hidden"
            name="existingPhotoUrl"
            value={record.photoUrl}
          />
        )}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <Select
            name="country"
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
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="accountType"
            className="block text-sm font-medium text-gray-700"
          >
            Account Type
          </label>
          <Select
            name="accountType"
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
          {errors.accountType && (
            <p className="text-red-500 text-sm">{errors.accountType}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            name="firstName"
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            name="lastName"
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            name="email"
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            name="contactNumber"
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
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">{errors.contactNumber}</p>
          )}
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="photo">Photo (optional)</Label>
          <Input
            name="photo"
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
          disabled={isPending}
          className="cursor-pointer w-full"
        >
          {isPending ? "Submitting..." : "Submit"}
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
