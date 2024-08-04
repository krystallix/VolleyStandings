<script setup lang="ts">
import axios from 'axios';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';

import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const value = ref<DateValue>()
const teams = ref<Team[]>([]);
const form = ref({
  team1_id: '',
  team2_id: '',
  score1: 0,
  score2: 0,
  date: '',
});

interface Team {
  team_id: string;
  team_name: string;
}

const router = useRouter();

async function fetchTeams() {
  try {
    const response = await axios.get('https://api.kesh.supply/getTeams');
    teams.value = response.data as Team[];
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
}

async function handleSubmit() {
  // Update the form.date with the selected value
  form.value.date = value.value ? value.value.toString() : '';

  if (!form.value.team1_id || !form.value.team2_id || form.value.score1 === undefined || form.value.score2 === undefined) {
    console.error('Please fill out all required fields.');
    return;
  }

  try {
    const response = await axios.post('https://api.kesh.supply/addMatches', form.value);
    console.log('Response:', response.data);
    router.push('/'); 
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

// Compute a string representation of the date for the hidden input
const dateString = computed(() => value.value ? value.value.toString() : '');

// Fetch teams on component mount
fetchTeams();
</script>

<template>
  <div class="container w-screen overflow-auto mt-5 lg:mt-10">
    <div class="flex items-center justify-center w-full h-full">
      <Card class="w-[700px]">
        <CardHeader>
          <CardTitle>Add Matches</CardTitle>
          <CardDescription>Volleyball Kanggotan Lor</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit">
            <div class="grid items-center w-full gap-4">
              <div class="p-4">
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="cn(
                        'w-[280px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground'
                      )"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="value" initial-focus />
                  </PopoverContent>
                </Popover>
              </div>
              <input type="hidden" name="date" :value="dateString" />
              <div class="grid xl:grid-cols-6 w-full">
                <div class="xl:col-span-4 p-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="name_team1">Team 1</Label>
                    <Select v-model="form.team1_id">
                      <SelectTrigger id="name_team1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem v-for="team in teams" :key="team.team_id" :value="String(team.team_id)">
                          {{ team.team_name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div class="xl:col-span-2 p-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="score1">Score Team 1</Label>
                    <Input id="score1" type="number" v-model.number="form.score1" placeholder="Score Team 1" />
                  </div>
                </div>
              </div>
              <div class="grid xl:grid-cols-6 w-full">
                <div class="xl:col-span-4 p-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="name_team2">Team 2</Label>
                    <Select v-model="form.team2_id">
                      <SelectTrigger id="name_team2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem v-for="team in teams" :key="team.team_id" :value="String(team.team_id)">
                          {{ team.team_name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div class="xl:col-span-2 p-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="score2">Score Team 2</Label>
                    <Input id="score2" type="number" v-model.number="form.score2" placeholder="Score Team 2" />
                  </div>
                </div>
              </div>
            </div>
            <CardFooter class="flex justify-end px-6 pb-6">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
