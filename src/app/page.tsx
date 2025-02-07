import { Bell, Search, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TaskCard } from "@/components/TaskCard"
import { useWallet } from "@/contexts/WalletContext"
import { useState } from "react"
import { useSupabase } from '@/hooks/useSupabase'

export default function Page() {
  const { address, connect, isConnecting } = useWallet();
  const { tasks, skills, loading, error } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'add' | 'use' | 'analytics'>('add');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-primary text-xl font-bold">
            HUMAN HOURS
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={connect}
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4" />
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            {address && (
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to do today?"
            className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Validated Skills</h2>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border">
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span className="font-medium">{skill.name}</span>
                <span className="text-gray-500">({skill.count})</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-4 border-b mb-8">
          <Button 
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('add')}
            className="font-medium"
          >
            Add $HH
          </Button>
          <Button 
            variant={activeTab === 'use' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('use')}
            className="text-gray-500"
          >
            Use $HH
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="text-gray-500"
          >
            Analytics
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </main>
    </div>
  );
} 