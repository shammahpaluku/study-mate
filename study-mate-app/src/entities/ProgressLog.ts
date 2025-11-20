import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { StudySession } from './StudySession';

type LogStatus = 'completed' | 'missed';

@Entity('progress_logs')
export class ProgressLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['completed', 'missed']
  })
  status: LogStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'logged_at' })
  loggedAt: Date;

  // Relations
  @ManyToOne(() => StudySession, (session) => session.progressLogs)
  @JoinColumn({ name: 'session_id' })
  studySession: StudySession;

  @ManyToOne(() => User, (user) => user.progressLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
