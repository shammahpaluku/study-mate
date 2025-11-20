import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { StudySession } from './StudySession';

type UnitDifficulty = 'easy' | 'moderate' | 'hard';
type UnitType = 'exam' | 'practical' | 'project';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'moderate', 'hard'],
    default: 'moderate'
  })
  difficulty: UnitDifficulty;

  @Column({
    type: 'enum',
    enum: ['exam', 'practical', 'project'],
    default: 'exam'
  })
  type: UnitType;

  @Column({ name: 'expected_assessment_date', type: 'date', nullable: true })
  expectedAssessmentDate: Date | null;

  @Column({ name: 'weight_score', type: 'integer', nullable: true })
  weightScore: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.units)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => StudySession, (session) => session.unit)
  studySessions: StudySession[];
}
