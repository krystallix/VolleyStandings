<script lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card' 
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { columns } from '@/components/ui/standings/columns';
import type { Standings, GroupData } from '@/components/ui/standings/columns';
import DataTable from '@/components/ui/standings/data-table.vue';
import { Badge } from '@/components/ui/badge'

// Define the structure for a recent match
interface RecentMatch {
  id: number;
  group_id: number;
  team_name1: string;
  team_name2: string;
  score1: number;
  score2: number;
  points_team1: number;
  points_team2: number;
  date: string;
}

// Define the structure for an upcoming match
interface UpcomingMatch {
  id: number;
  group_id: number;
  team_name1: string;
  team_name2: string;
  date: string;
}

export default {
  components: {
    DataTable,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Badge,
  },
  setup() {
    const grupA = ref<Standings[]>([]);
    const grupB = ref<Standings[]>([]);
    const recentMatches = ref<RecentMatch[]>([]);
    const upcomingMatches = ref<UpcomingMatch[]>([]);

    async function getData(): Promise<GroupData> {
      try {
        const response = await axios.get<GroupData>('https://api.kesh.supply/teamStats');
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return { groupA: [], groupB: [] }; // Fallback
      }
    }
    
    async function getUpcomingMatches() {
      try {
        const response = await axios.get<UpcomingMatch[]>('https://api.kesh.supply/upcomingMatches');
        upcomingMatches.value = filterUpcomingMatches(response.data);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
      }
    }

    async function getRecentMatches() {
      try {
        const response = await axios.get<RecentMatch[]>('https://api.kesh.supply/recentMatches');
        recentMatches.value = response.data;
      } catch (error) {
        console.error('Error fetching recent matches:', error);
      }
    }

    function processData(data: Standings[]): Standings[] {
      // Sort by points in descending order
      const sortedData = data.sort((a, b) => b.points - a.points);
      
      // Add increment number after sorting
      return sortedData.map((team, index) => ({ ...team, no: index + 1 }));
    }

    function formatDate(dateString: string): string {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function filterUpcomingMatches(matches: UpcomingMatch[]): UpcomingMatch[] {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      return matches.filter(match => match.date >= today);
    }

    onMounted(async () => {
      const data = await getData();
      grupA.value = processData(data.groupA || []);
      grupB.value = processData(data.groupB || []);
      await getRecentMatches();
      await getUpcomingMatches();
    });
    
    return {
      grupA,
      grupB,
      columns,
      recentMatches,
      upcomingMatches,
      formatDate
    };
  }
}
</script>


<template>
  <div class="container w-screen overflow-auto mt-5 lg:mt-10">
    <div class="flex items-center justify-center w-full h-full">
      <div class="grid xl:grid-cols-5 w-full">
        <div class="xl:col-span-3 p-4">
          <div>
            <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
              Standings
            </h1>
          </div>
          <div class="py-3">
            <h1 class="scroll-m-20 text-xl font-bold tracking-tight lg:text-1xl p-2">
              Group A</h1>
              <DataTable :columns="columns" :data="grupA" v-if="columns.length && grupA.length" />
          </div>
          <div class="py-3">
            <h1 class="scroll-m-20 text-xl font-bold tracking-tight lg:text-1xl p-2">
              Group B</h1>
              <DataTable :columns="columns" :data="grupB" v-if="columns.length && grupB.length" />
          </div>
          <div class="py">
            <h1>Sponsored and supported by :</h1>
          </div>
          <div class="py">
            <h1><Marquee>Jaya Mulyo, Tamar MX, Cloudsy Jogja, Ryan Rofiki Jogja, Mustofa Kamal, Indar Mart, dan seluruh Warga Kanggotan Lor 05</Marquee></h1>
          </div>
        </div>
        <div class="xl:col-span-2 p-4 rounded flex flex-col h-screen">
          <!-- Recent Matches Card -->
          <Card class="flex-1 overflow-hidden">
            <CardHeader class="py-1">
              <CardTitle>
                <h1 class="scroll-m-20 text-2xl font-bold tracking-tight lg:text-1xl">
                  Recent Matches
                </h1>
              </CardTitle>
              <CardDescription>Volleyball Kanggotan Lor</CardDescription>
            </CardHeader>
            <CardContent class="overflow-y-auto"  style="max-height: 19.5rem;">
              <div v-for="match in recentMatches" :key="match.id" class="mt-3">
                <div class="flex">
                  <div class="text-slate">Grup {{ match.group_id === 1 ? 'A' : 'B' }}</div>
                  <div class="text-slate px-3">{{ formatDate(match.date) }}</div>
                </div>
                <div class="w-full mt-1">
                  <Badge class="text-md mx-3">{{ match.team_name1 }}</Badge>
                  <span class="text-md">{{ match.score1 }}</span>
                  <span class="text-md">-</span>
                  <span class="text-md">{{ match.score2 }}</span>
                  <Badge class="text-md mx-3">{{ match.team_name2 }}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        
          <!-- Upcoming Matches Card -->
          <Card class="flex-1 mt-2 overflow-hidden">
            <CardHeader  class="py-1">
              <CardTitle>
                <h1 class="scroll-m-20 text-2xl font-bold tracking-tight lg:text-1xl">
                  Upcoming Matches
                </h1>
              </CardTitle>
              <CardDescription>Volleyball Kanggotan Lor</CardDescription>
            </CardHeader>
            <CardContent class="overflow-y-auto" style="max-height: 19.5rem;">
              <div v-for="match in upcomingMatches" :key="match.id" class="mt-3">
                <div class="flex">
                  <div class="text-slate">Grup {{ match.group_id === 1 ? 'A' : 'B' }}</div>
                  <div class="text-slate px-3">{{ formatDate(match.date) }}</div>
                </div>
                <div class="w-full mt-2">
                  <Badge class="text-md mx-3">{{ match.team_name1 }}</Badge>
                  <span class="text-md">VS</span>
                  <Badge class="text-md mx-3">{{ match.team_name2 }}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  </div>
</template>
