import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type PreferredSession = 'morning' | 'afternoon' | 'evening' | 'any';

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'available_hours', type: 'integer' })
  availableHours: number;

  @Column({
    name: 'preferred_session',
    type: 'enum',
    enum: ['morning', 'afternoon', 'evening', 'any'],
    default: 'any'
  })
  preferredSession: PreferredSession;

  // Relations
  @ManyToOne(() => User, (user) => user.availability)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
