"use client"

import React, { useMemo, useState } from "react"
import Avatar from "boring-avatars"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function AvatarPicker({ value, onChange }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const palettes = [
    ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    ["#6DB3F2", "#1C4E80", "#E6F7FF", "#F0A6CA", "#9B5DE5"],
    ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
    ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
  ]

  const avatarConfigs = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        seed: Math.random().toString(36).slice(2, 9),
        variant: "beam",
        colors: palettes[Math.floor(Math.random() * palettes.length)],
      })),
    [refreshKey]
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Choose an avatar</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="h-8"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Horizontal scroll area */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex flex-nowrap items-center gap-3 py-2 pr-3 touch-pan-x">
          {avatarConfigs.map((config) => {
            const selected =
              value?.seed === config.seed && value?.variant === config.variant
            return (
              <button
                key={`${config.seed}-${config.colors[0]}`}
                type="button"
                onClick={() => onChange(config)}
                className={`relative shrink-0 rounded-full p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected ? "ring-2 ring-purple-500" : "ring-0"
                }`}
                aria-label={`Choose avatar ${config.seed}`}
              >
                <Avatar
                  size={64}
                  name={config.seed}
                  variant={config.variant}
                  colors={config.colors}
                />
                {selected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] rounded bg-purple-600 text-white px-1.5 py-0.5">
                    Selected
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
