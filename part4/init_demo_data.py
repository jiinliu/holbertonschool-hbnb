#!/usr/bin/env python3
"""
HBnB Demo Data Initialization Script
This script populates the database with comprehensive demo data including:
- Multiple users with different roles
- Various amenities
- Places with amenities relationships
- Sample reviews from different users
"""

from app.services.facade import HBnBFacade
import sys
import os

# Add the current directory to Python path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def init_demo_data():
    """Initialize demo data for HBnB application"""
    facade = HBnBFacade()
    
    print("🚀 Starting demo data initialization...")
    
    # ===== CREATE USERS =====
    print("\n👥 Creating users...")
    
    users_data = [
        {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@hbnb.io',
            'password': 'john1234',
            'is_admin': False
        },
        {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane.smith@hbnb.io',
            'password': 'jane1234',
            'is_admin': False
        },
        {
            'first_name': 'Bob',
            'last_name': 'Wilson',
            'email': 'bob.wilson@hbnb.io',
            'password': 'bob1234',
            'is_admin': False
        },
        {
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'email': 'alice.johnson@hbnb.io',
            'password': 'alice1234',
            'is_admin': False
        },
        {
            'first_name': 'Jin',
            'last_name': 'Liu',
            'email': 'jin.liu@hbnb.io',
            'password': 'jin1234',
            'is_admin': False
        }
    ]
    
    created_users = {}
    for user_data in users_data:
        try:
            # Check if user already exists
            existing_user = facade.get_user_by_email(user_data['email'])
            if existing_user:
                print(f"  ⚠️  User {user_data['email']} already exists")
                created_users[user_data['email']] = existing_user
            else:
                user = facade.create_user(user_data)
                created_users[user_data['email']] = user
                print(f"  ✅ Created user: {user.first_name} {user.last_name} ({user.email})")
        except Exception as e:
            print(f"  ❌ Failed to create user {user_data['email']}: {e}")
    
    # Get admin user
    admin_user = facade.get_user_by_email('admin@hbnb.io')
    if admin_user:
        created_users['admin@hbnb.io'] = admin_user
        print(f"  ℹ️  Found existing admin user")
    
    # ===== CREATE AMENITIES =====
    print("\n🏠 Creating amenities...")
    
    amenities_data = [
        {'name': 'WiFi'},
        {'name': 'Air Conditioning'},
        {'name': 'Swimming Pool'},
        {'name': 'Gym'},
        {'name': 'Parking'},
        {'name': 'Kitchen'},
        {'name': 'Washing Machine'},
        {'name': 'TV'},
        {'name': 'Balcony'},
        {'name': 'Pet Friendly'},
        {'name': 'Smoking Allowed'},
        {'name': 'Fireplace'},
        {'name': 'Private Beach'},
        {'name': 'Yacht Access'},
        {'name': 'Personal Chef'},
        {'name': 'Spa Services'},
        {'name': 'Water Sports Equipment'},
        {'name': 'Helipad'},
        {'name': 'Private Dock'},
        {'name': 'Infinity Pool'}
    ]
    
    created_amenities = {}
    for amenity_data in amenities_data:
        try:
            # Check if amenity already exists
            existing_amenity = facade.get_amenity_by_name(amenity_data['name'])
            if existing_amenity:
                print(f"  ⚠️  Amenity {amenity_data['name']} already exists")
                created_amenities[amenity_data['name']] = existing_amenity
            else:
                amenity = facade.create_amenity(amenity_data)
                created_amenities[amenity_data['name']] = amenity
                print(f"  ✅ Created amenity: {amenity.name}")
        except Exception as e:
            print(f"  ❌ Failed to create amenity {amenity_data['name']}: {e}")
    
    # ===== CREATE PLACES WITH DIFFERENT OWNERS =====
    print("\n🏡 Creating places with different owners...")
    
    places_data = [
        {
            'title': 'Luxury Beach Villa',
            'description': 'Beautiful oceanfront villa with stunning views and private beach access',
            'price': 95.0,
            'latitude': 25.7617,
            'longitude': -80.1918,
            'owner_email': 'john.doe@hbnb.io',
            'amenities': ['WiFi', 'Swimming Pool', 'Air Conditioning', 'Kitchen', 'Parking', 'Balcony']
        },
        {
            'title': 'Cozy Mountain Cabin',
            'description': 'Rustic cabin perfect for hiking enthusiasts and nature lovers',
            'price': 45.0,
            'latitude': 39.7392,
            'longitude': -104.9903,
            'owner_email': 'jane.smith@hbnb.io',
            'amenities': ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Pet Friendly']
        },
        {
            'title': 'Urban Loft Apartment',
            'description': 'Modern loft in the heart of downtown with city skyline views',
            'price': 75.0,
            'latitude': 40.7128,
            'longitude': -74.0060,
            'owner_email': 'bob.wilson@hbnb.io',
            'amenities': ['WiFi', 'Air Conditioning', 'Gym', 'TV', 'Kitchen', 'Washing Machine']
        },
        {
            'title': 'Charming Garden Cottage',
            'description': 'Peaceful cottage surrounded by beautiful gardens and fruit trees',
            'price': 25.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner_email': 'alice.johnson@hbnb.io',
            'amenities': ['WiFi', 'Kitchen', 'Parking', 'Balcony', 'Pet Friendly']
        },
        {
            'title': 'Dodgy House Special',
            'description': 'Budget-friendly accommodation! Bring your own mattress, sleeping bag recommended. Shared bathroom down the hall (sometimes works). Perfect for adventurous travelers who love surprises!',
            'price': 8.0,
            'latitude': 34.0522,
            'longitude': -118.2437,
            'owner_email': 'alice.johnson@hbnb.io',
            'amenities': ['WiFi', 'Pet Friendly', 'Smoking Allowed']
        },
        {
            'title': 'Presidential Suite Penthouse',
            'description': 'Ultra-luxury penthouse with panoramic city views, private elevator, butler service, and rooftop helipad. Experience the pinnacle of opulent living.',
            'price': 899.0,
            'latitude': 40.7589,
            'longitude': -73.9851,
            'owner_email': 'john.doe@hbnb.io',
            'amenities': ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Kitchen', 'Balcony']
        },
        {
            'title': 'Royal Castle Estate',
            'description': 'Historic castle with 50+ rooms, private vineyards, horse stables, and medieval banquet hall. Perfect for royalty or those who dream to be.',
            'price': 1250.0,
            'latitude': 51.5074,
            'longitude': -0.1278,
            'owner_email': 'jane.smith@hbnb.io',
            'amenities': ['Fireplace', 'Kitchen', 'Parking', 'Pet Friendly', 'Swimming Pool', 'Balcony']
        },
        {
            'title': 'Private Island Paradise',
            'description': 'Exclusive private island resort with white sandy beaches, crystal clear waters, personal chef, and yacht included. Ultimate luxury escape.',
            'price': 2500.0,
            'latitude': 25.0343,
            'longitude': -77.3963,
            'owner_email': 'bob.wilson@hbnb.io',
            'amenities': ['Private Beach', 'Yacht Access', 'Personal Chef', 'Spa Services', 'Water Sports Equipment', 'Infinity Pool', 'WiFi', 'Private Dock']
        }
    ]
    
    created_places = {}
    for place_data in places_data:
        try:
            owner = created_users.get(place_data['owner_email'])
            if not owner:
                print(f"  ❌ Owner {place_data['owner_email']} not found for place {place_data['title']}")
                continue
                
            place_create_data = {
                'title': place_data['title'],
                'description': place_data['description'],
                'price': place_data['price'],
                'latitude': place_data['latitude'],
                'longitude': place_data['longitude'],
                'owner_id': owner.id
            }
            
            place = facade.create_place(place_create_data)
            created_places[place.title] = place
            
            # Add amenities to place
            for amenity_name in place_data['amenities']:
                amenity = created_amenities.get(amenity_name)
                if amenity:
                    place.amenities_r.append(amenity)
            
            print(f"  ✅ Created place: {place.title} (Owner: {owner.first_name} {owner.last_name})")
            print(f"      💡 Added {len(place_data['amenities'])} amenities")
            
        except Exception as e:
            print(f"  ❌ Failed to create place {place_data['title']}: {e}")
    
    # ===== CREATE REVIEWS =====
    print("\n📝 Creating sample reviews...")
    
    reviews_data = [
        {
            'place_title': 'Luxury Beach Villa',
            'reviewer_email': 'jane.smith@hbnb.io',
            'text': 'Absolutely stunning! The beach access was amazing and the villa was impeccably clean. Perfect for a romantic getaway.',
            'rating': 5
        },
        {
            'place_title': 'Luxury Beach Villa', 
            'reviewer_email': 'bob.wilson@hbnb.io',
            'text': 'Great location and beautiful views. The swimming pool was a nice touch. Would definitely stay again!',
            'rating': 4
        },
        {
            'place_title': 'Cozy Mountain Cabin',
            'reviewer_email': 'alice.johnson@hbnb.io', 
            'text': 'Perfect retreat for nature lovers. The fireplace was cozy and the hiking trails nearby were excellent.',
            'rating': 5
        },
        {
            'place_title': 'Cozy Mountain Cabin',
            'reviewer_email': 'john.doe@hbnb.io',
            'text': 'Nice cabin but a bit remote. The kitchen was well-equipped though. Good for a quiet weekend.',
            'rating': 4
        },
        {
            'place_title': 'Urban Loft Apartment',
            'reviewer_email': 'jane.smith@hbnb.io',
            'text': 'Modern and stylish! The city views were incredible and the gym access was convenient.',
            'rating': 5
        },
        {
            'place_title': 'Urban Loft Apartment',
            'reviewer_email': 'alice.johnson@hbnb.io',
            'text': 'Great location for exploring the city. Clean and well-maintained. The AC worked perfectly.',
            'rating': 4
        },
        {
            'place_title': 'Charming Garden Cottage',
            'reviewer_email': 'bob.wilson@hbnb.io',
            'text': 'So peaceful and charming! The garden was beautiful and it was pet-friendly which was perfect for us.',
            'rating': 5
        },
        {
            'place_title': 'Charming Garden Cottage',
            'reviewer_email': 'john.doe@hbnb.io',
            'text': 'Lovely cottage with a great garden. Very quiet and relaxing. Host was very responsive.',
            'rating': 4
        }
    ]
    
    for review_data in reviews_data:
        try:
            place = created_places.get(review_data['place_title'])
            reviewer = created_users.get(review_data['reviewer_email'])
            
            if not place:
                print(f"  ❌ Place {review_data['place_title']} not found")
                continue
            if not reviewer:
                print(f"  ❌ Reviewer {review_data['reviewer_email']} not found")
                continue
                
            review_create_data = {
                'text': review_data['text'],
                'rating': review_data['rating'],
                'user_id': reviewer.id,
                'place_id': place.id
            }
            
            review = facade.create_review(review_create_data)
            print(f"  ✅ Created review: {reviewer.first_name} reviewed {place.title} ({review.rating}⭐)")
            
        except Exception as e:
            print(f"  ❌ Failed to create review for {review_data['place_title']}: {e}")
    
    print("\n🎉 Demo data initialization completed!")
    print("\n📊 Summary:")
    print(f"  - Users: {len(created_users)}")
    print(f"  - Amenities: {len(created_amenities)}")
    print(f"  - Places: {len(created_places)}")
    print(f"  - Reviews: {len(reviews_data)}")
    
    print("\n🔐 Demo user credentials:")
    print("  - admin@hbnb.io / admin1234 (Admin)")
    print("  - john.doe@hbnb.io / john1234")
    print("  - jane.smith@hbnb.io / jane1234")
    print("  - bob.wilson@hbnb.io / bob1234")
    print("  - alice.johnson@hbnb.io / alice1234")
    print("  - jin.liu@hbnb.io / jin1234")

if __name__ == '__main__':
    init_demo_data()