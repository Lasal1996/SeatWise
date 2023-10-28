<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon; // Import Carbon for working with dates and times
use App\Models\Tablefortwo;
use App\Models\TableReservation;
use App\Models\Restaurants;
use App\Models\User;

class TablefortwoController extends Controller
{
    //reserve(placed) by user
    public function getRequests($id)
    {
        $reservations = TableReservation::where('reservant_ID', $id)->get();
        return response()->json($reservations);
    }


    //view available tablefortwo slots
    public function getInvitations($id)
    {
        $oneHourAhead = Carbon::now()->addHour();
        $currentDate = Carbon::now()->toDateString();

        // Retrieve reservations that meet the specified criteria
        $reservations = TableReservation::where(function ($query) use ($id, $currentDate, $oneHourAhead) {
            $query->where('reservant_ID', '!=', $id)
                ->where('tablefortwo', 1)
                ->where(function ($query) use ($currentDate, $oneHourAhead) {
                    $query->where('reservation_date', '>', $currentDate)
                          ->orWhere(function ($query) use ($currentDate, $oneHourAhead) {
                              $query->where('reservation_date', '=', $currentDate)
                                    ->where('start_time', '>', $oneHourAhead);
                          });
                });
        })
        ->get();
        return response()->json($reservations);
    }

    //accepted by the user
    public function getAcceptedInvites($id)
    {
        $currentDate = Carbon::now()->toDateString(); // Get the current date in 'Y-m-d' format
    
        $acceptedInvites = TableForTwo::where('acceptedID', $id)
            ->where('status', 'accepted')
            ->whereHas('reservation', function ($query) use ($currentDate) {
                $query->whereDate('reservation_date', '>', $currentDate);
            })
            ->with('reservation') // Eager load the reservation relationship
            ->get();
    
        return response()->json($acceptedInvites);
    }

        //accepted by the user
        public function getTodayInvites($id)
        {
            $currentDate = Carbon::now()->toDateString(); // Get the current date in 'Y-m-d' format
        
            $acceptedInvites = TableForTwo::where('acceptedID', $id)
                ->where('status', 'accepted')
                ->whereHas('reservation', function ($query) use ($currentDate) {
                    $query->whereDate('reservation_date', '=', $currentDate);
                })
                ->with('reservation') // Eager load the reservation relationship
                ->get();
        
            return response()->json($acceptedInvites);
        }
        
    //------------------------------------------------------------------------------------------------------------------------
    //--------------------------------------------Work In Progress------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------
    public function cancelReservation($id)
    {
        try {
            // Find the reservation by 'reservationid' (which is the $id parameter)
            $reservation = TableForTwo::findOrFail($id);
    
            // Check if the reservation exists and its status is not canceled
            if ($reservation->status !== 'rejected') {
                // Update the reservation status to 'canceled'
                $reservation->status = 'rejected';
                $reservation->save();
    
                // You can return a success response here if needed
                return response()->json(['message' => 'Reservation canceled successfully']);
            } else {
                // Reservation is already canceled
                return response()->json(['message' => 'Reservation is already canceled']);
            }
        } catch (\Exception $e) {
            // Handle any exceptions (e.g., reservation not found)
            return response()->json(['error' => 'Reservation not found'], 404);
        }
    }


    

    //requested by user
    public function getAcceptedRequests($id)
    {
        $requests = TableReservation::where('reservant_ID', $id)
        ->where('tablefortwo', 1)
        ->whereHas('tablefortwo', function ($query) {
            $query->where('status', 'accepted');
        })
        ->get();

        return response()->json($requests);
    }

    public function getPendingInvites()
    {
        $currentDate = Carbon::now()->toDateString(); // Get the current date in 'Y-m-d' format
    
        $Invites = TableForTwo::where('status', 'pending')
            ->whereHas('reservation', function ($query) use ($currentDate) {
                $query->whereDate('reservation_date', '>', $currentDate);
            })
            ->with('reservation') // Eager load the reservation relationship
            ->get();
    
        return response()->json($Invites);
    }

    //requested by user,yet pending
    public function getPendingInvitations($id)
    {
        $requests = TableReservation::where('reservant_ID', $id)
        ->where('tablefortwo', 1)
        ->whereHas('tablefortwo', function ($query) {
            $query->where('status', 'pending');
        })
        ->get();

        return response()->json($requests);
    }
    
    //history ,requested by user
    public function getHistoryRequests($id)
    {
        $requests = TableReservation::where('reservant_ID', $id)
            ->where('tablefortwo', 1)
            ->whereHas('tablefortwo.user', function ($query) {
                $query->whereColumn('acceptedID', 'users.id') 
                      ->where('status', 'completed')
                      ->orWhere('status', 'rejected');
            })
            ->with(['restaurant' , 'tablefortwo'])
            ->get();
    
        return response()->json($requests);
    }

    //hostory, accepted by user
    public function getHistoryAcceptedRequests($id)
    {
        $statuses = ['completed', 'rejected'];
    
        $Invites = TableForTwo::where('acceptedID', $id)
            ->whereIn('status', $statuses)
            ->with('reservation') // Eager load the reservation relationship
            ->get();
    
        return response()->json($Invites);
    }

}
