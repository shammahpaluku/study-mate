import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { StudySession } from './StudySession';

@Entity('study_plans')
export class StudyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'generated_at', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt: Date;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.studyPlans)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StudySession, (session) => session.studyPlan)
  studySessions: StudySession[];
}
