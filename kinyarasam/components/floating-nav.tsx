"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

interface FloatingNavProps {
  navItems: {
    name: string
    href: string
  }[]
  activeSection: string
}

export function FloatingNav({ navItems, activeSection }: FloatingNavProps) {
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="pt-16">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 inset-x-0 z-50 mx-auto w-fit px-4"
    >
      <nav className="flex items-center justify-center space-x-1 rounded-full border border-primary/20 bg-background/80 px-4 py-2 backdrop-blur-md">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === item.href.substring(1) ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeSection === item.href.substring(1) && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 rounded-full bg-primary/10"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{item.name}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}
