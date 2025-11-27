import bpy
import sys
import os

def cleanup_mesh(obj):
    """Clean up mesh geometry"""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    
    # Enter edit mode
    bpy.ops.object.mode_set(mode='EDIT')
    
    # Select all
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Remove doubles
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    
    # Delete loose geometry
    bpy.ops.mesh.delete_loose()
    
    # Fill holes
    bpy.ops.mesh.fill_holes(sides=0)
    
    # Recalculate normals
    bpy.ops.mesh.normals_make_consistent(inside=False)
    
    # Back to object mode
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print(f"✓ Cleaned mesh: {obj.name}")

def decimate_mesh(obj, target_faces=50000):
    """Reduce polygon count while preserving detail"""
    current_faces = len(obj.data.polygons)
    
    if current_faces <= target_faces:
        print(f"✓ Mesh already optimized: {current_faces} faces")
        return
    
    # Add decimate modifier
    modifier = obj.modifiers.new(name="Decimate", type='DECIMATE')
    modifier.ratio = target_faces / current_faces
    modifier.use_collapse_triangulate = True
    
    # Apply modifier
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier="Decimate")
    
    final_faces = len(obj.data.polygons)
    print(f"✓ Decimated: {current_faces} → {final_faces} faces")

def optimize_uvs(obj):
    """Optimize UV mapping"""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Smart UV project
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.02)
    
    # Pack UVs
    bpy.ops.uv.pack_islands(margin=0.01)
    
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"✓ Optimized UVs: {obj.name}")

def process_model(input_path, output_path, target_faces=50000):
    """Main processing pipeline"""
    print(f"\n{'='*60}")
    print(f"Processing: {input_path}")
    print(f"{'='*60}\n")
    
    # Clear scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Import GLB
    bpy.ops.import_scene.gltf(filepath=input_path)
    
    # Process each mesh
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            print(f"\nProcessing mesh: {obj.name}")
            cleanup_mesh(obj)
            decimate_mesh(obj, target_faces)
            optimize_uvs(obj)
    
    # Export GLB
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_texture_dir='',
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_colors=True,
    )
    
    print(f"\n{'='*60}")
    print(f"✓ Export complete: {output_path}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: blender --background --python blender-cleanup.py -- <input.glb> <output.glb> [target_faces]")
        sys.exit(1)
    
    # Args after '--' are in sys.argv[4:]
    input_file = sys.argv[4]
    output_file = sys.argv[5]
    target_faces = int(sys.argv[6]) if len(sys.argv) > 6 else 50000
    
    if not os.path.exists(input_file):
        print(f"Error: Input file not found: {input_file}")
        sys.exit(1)
    
    process_model(input_file, output_file, target_faces)
