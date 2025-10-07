from django.core.management.base import BaseCommand
from accounts.models import MarketplaceProduct
from decimal import Decimal
import random

class Command(BaseCommand):
    help = "Adds bulk marketplace products with individual Cloudinary images"

    def handle(self, *args, **options):
        # Each product now has its own Cloudinary image
        products_data = {
            'seeds': {
                "Hybrid Tomato Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830990/green-house-hybrid-cherry-tomato-seeds_sslxer.jpg",
                "Organic Cucumber Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830993/organic_cucumber_qnxbtp.jpg",
                "Maize Hybrid Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830991/maize-hybrid-seeds_fbetth.jpg",
                "Wheat Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830988/wheat_seeds_juvndt.jpg",
                "Sunflower Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830987/sunflower_seeds_pomth3.jpg",
                "Paddy Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830984/paddy_seeds_rycipg.jpg",
                "Okra Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830993/okra-seeds_gczjas.jpg",
                "Capsicum Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830983/capsicum_seeds_axppjh.jpg",
                "Chilli Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830984/mirchi_seeds_p0dkgb.jpg",
                "Carrot Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830983/carrot_seeds_fdfypc.jpg",
                "Pumpkin Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830985/pumpkin_seeds_qlqlm3.jpg",
                "Spinach Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830991/spinanch_seeds_qj8u7s.jpg",
                "Onion Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830992/onions_seeds_gjg6bb.jpg",
                "Mustard Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830993/musturd_seeds_w3o7ak.jpg",
                "Corn Seeds": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759830993/corn_seeds_ctvkkp.jpg"
            },
            'fertilizers': {
                "Nitrogen Fertilizer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831374/nitrogen_fertilizers_xlx0i7.jpg",
                "Organic Compost": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831373/organic_compost_dwsska.jpg",
                "Phosphate Fertilizer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831374/phospate_fertlizer_uzwvf9.jpg",
                "Urea": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831374/urea_mreyzx.jpg",
                "NPK 10-26-26": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831373/npk_c7mfy0.jpg",
                "Vermicompost": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831374/vermi_compost_ev990q.jpg",
                "Bio Fertilizer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831372/bio_fertlilizers_rrdajp.jpg",
                "Potash Fertilizer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831373/potash_yeswz7.jpg",
                "Seaweed Extract": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831373/swead_extract_jmd8bo.jpg ",
                "Bone Meal": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831372/bone_meal_brw5fx.jpg ",
                "Neem Cake": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831372/neem_cake_jyvmpr.jpg ",
                "Zinc Sulphate": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831374/Zinc_sulphate_mg10gx.jpg",
                "Magnesium Sulphate": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831372/magnisium_sulphate_okg2iz.jpg",
                "Micro Nutrient Mix": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759831372/micro_nutrients_pwvtd9.jpg"
            },
            'tools': {
                "Hand Trowel": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/hand_trowel_crjron.jpg",
                "Pruning Shears": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/pruning_shriels_inspbe.jpg",
                "Sickle": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Sickle_xrmzan.jpg",
                "Hoe": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Hoe_t1ryzf.jpg",
                "Rake": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Rake_gabmsm.jpg",
                "Spade": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Spade_nc57n9.jpg",
                "Watering Can": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832228/Watering_Can_x9lpph.jpg",
                "Wheelbarrow": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832228/Wheelbarrow_eiyeo2.jpg",
                "Seed Planter": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Seed_Planter_so8ure.jpg",
                "Sprayer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832228/Sprayer_i1hiyg.jpg",
                "Weeder": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832228/Weeder_jwbaso.jpg",
                "Cultivator": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832217/Cultivator_ukxsdr.jpg",
                "Hand Gloves": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832217/Hand_Gloves_puwkes.jpg",
                "Soil Scoop": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832218/Soil_Scoop_y2wzkn.jpg"
            },
            'equipment': {
                "Mini Tractor": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832500/Mini_Tractor_vkkszx.jpg",
                "Power Tiller": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832501/Power_Tiller_cd22wf.jpg",
                "Rotavator": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832510/Rotavator_jv5xex.jpg",
                "Disc Harrow": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832496/Disc_Harrow_x02s5t.jpg",
                "Seed Drill": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832511/Seed_Drill_rhbaii.jpg",
                "Water Pump": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832520/Water_Pump_ykmdqx.jpg",
                "Threshing Machine": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832520/Threshing_Machine_gnf0lm.jpg",
                "Spray Machine": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832520/Spray_Machine_icnis3.jpg",
                "Milking Machine": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832498/Milking_Machine_gxchgg.jpg",
                "Chaff Cutter": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832496/Chaff_Cutter_zk2io9.jpg",
                "Plough Machine": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832500/Plough_Machine_swqa7m.jpg",
                "Rice Transplanter": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832507/Rice_Transplanter_bbns1k.jpg",
                "Maize Sheller": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832497/Maize_Sheller_de3lyh.jpg",
                "Drone Sprayer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832497/Drone_Sprayer_stoko0.jpg",
                "Soil Moisture Sensor": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832514/Soil_Moisture_Sensor_j28drc.jpg"
            },
            'organic': {
                "Organic Neem Oil": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Neem_Oil_lyzmfn.jpg",
                "Organic Compost Mix": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Compost_Mix_ixvwgp.jpg",
                "Panchagavya": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832821/Panchagavya_padalb.jpg",
                "Jeevamrutha": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Jeevamrutha_qmjgre.jpg",
                "Vermicompost Bag": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832821/Vermicompost_Bag_fsffik.jpg",
                "Organic Soil Conditioner": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Soil_Conditioner_lexsrb.jpg",
                "Bio Pest Repellent": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Bio_pesticides_ssytpq.jpg",
                "Organic Growth Booster": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Growth_Booster_rs54sq.jpg",
                "Liquid Seaweed Fertilizer": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Liquid_Seaweed_Fertilizer_kbejrk.jpg",
                "Organic Potting Mix": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Potting_Mix_xaajud.jpg",
                "Organic Insecticide": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Insecticide_ikkgcv.jpg",
                "Natural Pesticide": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Natural_Pesticide_ko9pzm.jpg",
                "Organic Mulch": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832820/Organic_Mulch_i80njc.jpg",
                "Coconut Coir Pith": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Coconut_Coir_Pith_epybsd.jpg",
                "Compost Activator": "https://res.cloudinary.com/dpiogqjk4/image/upload/v1759832819/Compost_Activator_nazeoe.jpg"
            }
        }

        descriptions = {
            'seeds': "High-quality seeds for increased yield and resilience.",
            'fertilizers': "Organic and chemical fertilizers to enrich soil.",
            'tools': "Essential farming tools designed for efficiency.",
            'equipment': "Modern farming equipment to simplify tasks.",
            'organic': "Certified organic farming supplies for sustainability."
        }

        for category, items in products_data.items():
            for name, image_url in items.items():
                MarketplaceProduct.objects.create(
                    name=name,
                    category=category,
                    price=Decimal(random.uniform(50, 5000)).quantize(Decimal('0.01')),
                    stock=random.randint(10, 100),
                    description=descriptions[category],
                    images_market=image_url
                )

        self.stdout.write(self.style.SUCCESS("✅ All marketplace products added with unique Cloudinary images!"))
