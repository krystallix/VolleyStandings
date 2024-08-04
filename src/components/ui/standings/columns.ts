import { ColumnDef } from "@tanstack/vue-table";

export interface Standings {
    team_name: string;
    group_id: number;
    wins: number;
    losses: number;
    total_matches: number;
    points: number;
    wins_3_0: number;
    wins_3_1: number;
    wins_3_2: number;
    losses_0_3: number;
    losses_1_3: number;
    losses_2_3: number;
  }

  export type GroupData = {
    groupA: Standings[];
    groupB: Standings[];
  };
  
  export const columns: ColumnDef<Standings>[] = [
    {
      accessorKey: 'no',
      header: '#'
    },
    {
      accessorKey: 'team_name',
      header: 'Team Name'
    },
    {
      accessorKey: 'wins',
      header: 'W'
    },
    {
      accessorKey: 'losses',
      header: 'L'
    },
    {
      accessorKey: 'total_matches',
      header: 'T'
    },
    {
      accessorKey: 'points',
      header: 'Pts.'
    },
    {
      accessorKey: 'wins_3_0',
      header: '3-0'
    },
    {
      accessorKey: 'wins_3_1',
      header: '3-1'
    },
    {
      accessorKey: 'wins_3_2',
      header: '3-2'
    },
    {
      accessorKey: 'losses_0_3',
      header: '0-3'
    },
    {
      accessorKey: 'losses_1_3',
      header: '1-3'
    },
    {
      accessorKey: 'losses_2_3',
      header: '2-3'
    }
  ];