import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AdminComponent} from './components/admin/admin.component';
import {AdminSettingsComponent} from './components/admin/admin-settings/admin-settings.component';
import {AdminUsersComponent} from './components/admin/admin-users/admin-users.component';
import {AdminEmailSettingsComponent} from './components/admin/admin-email-settings/admin-email-settings.component';
import {ProfileComponent} from './components/profile/profile.component';
import {UserInfoComponent} from './components/profile/user-info/user-info.component';
import {UserEditComponent} from './components/profile/user-edit/user-edit.component';
import {ProfileDetailsResolver} from './components/profile/profile.details.resolver';
import {UserGroupsComponent} from './components/profile/user-groups/user-groups.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ConfigComponent} from './components/config/config.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AdminGuardGuard} from './components/admin/admin-guard.guard';
import {SurveyComponent} from './components/nurse/survey/survey.component';
import {DistrictsComponent} from './components/admin/sites/districts.component';
import {IncidentComponent} from './components/nurse/incident/incident.component';
import {AdminSchoolsComponent} from './components/admin/admin-schools/admin-schools.component';
import {ReportsComponent} from './components/reports/reports.component';
import {HygieneComponent} from './components/nurse/hygiene/hygiene.component';
import {GlovesComponent} from './components/nurse/gloves/gloves.component';
import {SurveyReportsComponent} from './components/reports/survey-reports/survey-reports.component';
import {TracingComponent} from './components/nurse/tracing/tracing.component';
import {TestsComponent} from './components/reports/tests/tests.component';
import {PatientsComponent} from './components/reports/patients/patients.component';
import {RegisterComponent} from './components/register/register.component';
import {PatientDetailsComponent} from './components/reports/patients/patient-details/patient-details.component';
import {PatientDetailsResolver} from './components/reports/patients/patient-details/patient.details.resolver';
import {ScreeningComponent} from './components/dashboard/screening/screening.component';
import {PassesComponent} from './components/passes/passes.component';
import {VerifyComponent} from './components/verify/verify.component';
import {VaccinationComponent} from "./components/dashboard/vaccination/vaccination.component";

const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'config', component: ConfigComponent},
    {path: 'passes', component: PassesComponent},
    {path: 'survey', component: SurveyComponent},
    {path: 'screening', component: ScreeningComponent},
    {path: 'incidents', component: IncidentComponent},
    {path: 'hygiene', component: HygieneComponent},
    {path: 'vaccines', component: VaccinationComponent},
    {path: 'tests', component: TestsComponent},
    {path: 'gloves', component: GlovesComponent},
    {path: 'tracing', component: TracingComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'resetPassword', component: ResetPasswordComponent},
    {path: 'edit', component: UserEditComponent}, // SELF-INFO-UPDATE **cjm**
    {path: 'verify/:id', component: VerifyComponent},
    {
        path: 'admin', component: AdminComponent, canActivate: [AdminGuardGuard],
        children: [{
            path: '', redirectTo: 'users', pathMatch: 'full'
        }, {
            path: 'districts',
            component: DistrictsComponent
        }, {
            path: 'settings',
            component: AdminSettingsComponent
        }, {
            path: 'users',
            component: AdminUsersComponent
        }, {
            path: 'email',
            component: AdminEmailSettingsComponent
        }, {
            path: 'schools',
            component: AdminSchoolsComponent
        }]
    },
    {
        path: 'user/:id', component: ProfileComponent, resolve: {user: ProfileDetailsResolver},
        children: [{
            path: '', redirectTo: 'profile', pathMatch: 'full'
        }, {
            path: 'profile', component: UserInfoComponent
        }, {
            path: 'groups', component: UserGroupsComponent
        }]
    },
    {
        path: 'reports', component: ReportsComponent, canActivate: [AdminGuardGuard],
        children: [
            {
                path: '', redirectTo: 'surveys', pathMatch: 'full'
            },
            {
                path: 'surveys', component: SurveyReportsComponent
            },
            {
                path: 'tests', component: TestsComponent
            },
            {
                path: 'patients', component: PatientsComponent
            },
            {
                path: 'patients/:patientId',
                component: PatientDetailsComponent,
                resolve: {patient: PatientDetailsResolver}
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
