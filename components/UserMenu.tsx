"use client"

import { useState, useRef, useEffect } from "react"
import type { User } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { firebaseAuth } from "@/lib/firebase-client"
import { onAuthStateChanged, signOut } from "firebase/auth"

export default function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const auth = firebaseAuth
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (sessionUser) => {
      setUser(sessionUser ?? null)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const auth = firebaseAuth
    if (!auth) {
      router.push('/login')
      return
    }
    await signOut(auth)
    router.push('/login')
  }

  // Show login button for guest users
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
      >
        ログイン
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors bg-green-50 border border-green-300"
      >
        <span className="text-sm font-medium text-gray-900">
          ログイン済み
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}
