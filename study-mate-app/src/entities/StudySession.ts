import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { StudyPlan } from './StudyPlan';
import { Unit } from './Unit';
import { ProgressLog } from './ProgressLog';

type SessionType = 'deep_focus' | 'sprint' | 'revision';
type SessionStatus = 'pending' | 'completed' | 'missed';

@Entity('study_sessions')
export class StudySession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plan_id' })
  planId: string;

  @Column({ name: 'unit_id' })
  unitId: string;

  @Column({ name: 'session_date', type: 'date' })
  sessionDate: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({
    name: 'session_type',
    type: 'enum',
    enum: ['deep_focus', 'sprint', 'revision']
  })
  sessionType: SessionType;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'missed'],
    default: 'pending'
  })
  status: SessionStatus;

  // Relations
  @ManyToOne(() => StudyPlan, (plan) => plan.studySessions)
  @JoinColumn({ name: 'plan_id' })
  studyPlan: StudyPlan;

  @ManyToOne(() => Unit, (unit) => unit.studySessions)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(() => ProgressLog, (log) => log.studySession)
  progressLogs: ProgressLog[];
}
