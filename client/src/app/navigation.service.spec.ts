import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let navigationS: NavigationService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [Location]
    });
    navigationS = TestBed.inject(NavigationService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(navigationS).toBeTruthy();
  });

  it('should call history.back method', () => {
    location.back = jasmine.createSpy();

    navigationS.back();

    expect(location.back).toHaveBeenCalled();
  });
});
