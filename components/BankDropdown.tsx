"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBankChange = (id: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });

    router.push(newUrl, { scroll: false });
    setValue?.("senderBank", id);
  };

  return (
    <Select onValueChange={handleBankChange}>
      <SelectTrigger
        className={`flex w-full gap-3 ${otherStyles}`} style={{padding:'0.5rem'}}
      >
        <Image
          src="/icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />

        {/* 🔑 REQUIRED FOR RADIX */}
        <SelectValue placeholder="Select bank" />
      </SelectTrigger>

      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel className="text-gray-500">
            Select a bank
          </SelectLabel>

          {accounts.map((account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
            >
              <div className="flex flex-col">
                <span className="font-medium">{account.name}</span>
                <span className="text-sm text-blue-600">
                  {formatAmount(account.currentBalance)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
