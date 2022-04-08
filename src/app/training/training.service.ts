import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { map, Subject, Subscription } from "rxjs";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercicesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];
    private exercicesCollection: AngularFirestoreCollection<Exercise>;

    constructor(private firestore: AngularFirestore, private uiService: UIService) { }

    private availibleExercises: Exercise[] = [];

    private runingExercise: Exercise;


    fetchAvaliableExercises() {
        this.exercicesCollection = this.firestore.collection('avalibleExercises');

        this.uiService.loadingStateChange.next(true);
        this.fbSubs.push(this.exercicesCollection.snapshotChanges().pipe(
            map(dockArray => {

                return dockArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    }
                })
            })).subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChange.next(false);
                this.availibleExercises = exercises;
                this.exercicesChanged.next([...this.availibleExercises])

            }, error => {
                this.uiService.loadingStateChange.next(false);
                this.uiService.showSnakbar('Fetching exercise failed, please try again later', null, 3000);
                this.exercicesChanged.next(null);
            }))

    }

    startExercise(selectedId: string) {
        // this.firestore.doc('availibleExercises/'+selectedId).update({lastSelected: new Date()});
        this.runingExercise = this.availibleExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runingExercise });

    }

    completeExercise() {
        this.addDataToDatabases({ ...this.runingExercise, date: new Date(), state: 'completed' });
        this.runingExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabases({
            ...this.runingExercise,
            duration: this.runingExercise.duration * (progress / 100),
            calories: this.runingExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runingExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercises() {
        return { ...this.runingExercise };
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    fetchPastExercises() {
        this.fbSubs.push(this.firestore.collection<Exercise>('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises)
        }));
    }

    private addDataToDatabases(exercise: Exercise) {
        this.firestore.collection<Exercise>('finishedExercises').add(exercise);
    }

}